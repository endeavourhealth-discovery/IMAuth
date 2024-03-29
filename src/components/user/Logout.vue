<template>
  <div class="flex flex-row align-items-center">
    <Card class="flex flex-column justify-content-sm-around align-items-center logout-card">
      <template #header>
        <i class="fa-solid fa-arrow-right-from-bracket icon-header" aria-hidden="true" />
      </template>
      <template #title> Logout </template>
      <template #content>
        <div class="p-fluid logout-form">
          <div class="field">
            <div class="p-text-left">Current User:</div>
          </div>
          <div class="field">
            <div v-if="isLoggedIn" class="flex flex-row align-items-center p-text-capitalize">
              <img
                data-testid="logout-avatar-image"
                v-if="isLoggedIn"
                id="user-icon"
                class="avatar-icon"
                :src="getUrl(currentUser.avatar)"
                alt="avatar icon"
                aria-haspopup="true"
                aria-controls="overlay_menu"
              />
              <p id="username-display">{{ currentUser.username }}</p>
            </div>
            <div v-if="!isLoggedIn" class="p-text-left p-text-capitalize">Guest</div>
          </div>
          <div class="flex flex-row justify-content-center">
            <Button data-testid="logout-submit" class="user-submit" type="submit" label="Logout" @click="handleSubmit" />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent } from "vue";
import { mapState, useStore } from "vuex";
import { Models } from "im-library";
import Swal, { SweetAlertResult } from "sweetalert2";
import { useRouter } from "vue-router";

const router = useRouter();
const store = useStore();
const currentUser = computed(() => store.state.currentUser);
const isLoggedIn = computed(() => store.state.isLoggedIn);
const previousAppUrl = computed(() => store.state.previousAppUrl);

function handleSubmit(): void {
  Swal.fire({
    icon: "warning",
    title: "Are you sure?",
    text: "Confirm logout request",
    showCancelButton: true,
    confirmButtonText: "OK",
    reverseButtons: true
  }).then((result: SweetAlertResult) => {
    if (result.isConfirmed) {
      store.dispatch("logoutCurrentUser").then((res: Models.CustomAlert) => {
        if (res.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: res.message
          }).then(() => {
            if (previousAppUrl.value) {
              window.location.href = previousAppUrl.value;
            } else {
              router.push({ name: "Login" });
            }
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: res.message
          });
        }
      });
    }
  });
}

function getUrl(item: string): string {
  const url = new URL(`../../assets/avatars/${item}`, import.meta.url);
  return url.href;
}
</script>

<style scoped>
.user-submit {
  width: fit-content !important;
}

.logout-form {
  max-width: 25em;
  min-width: 15em;
}

.logout-card {
  padding: 0 2em;
}

.avatar-icon {
  width: 3rem;
  border: 1px solid lightgray;
  border-radius: 50%;
  margin-right: 0.5rem;
}

.icon-header {
  font-size: 5rem;
  margin-top: 1em;
}
</style>
