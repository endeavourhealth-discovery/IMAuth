<template>
  <div class="flex flex-row align-items-center">
    <Card class="flex flex-column justify-content-sm-around align-items-center logout-card">
      <template #header>
        <i class="fa-solid fa-arrow-right-from-bracket icon-header" aria-hidden="true" />
      </template>
      <template #title>
        Logout
      </template>
      <template #content>
        <div class="p-fluid logout-form">
          <div class="field">
            <div class="p-text-left">Current User:</div>
          </div>
          <div class="field">
            <div v-if="isLoggedIn" class="flex flex-row align-items-center p-text-capitalize">
              <img
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
            <div v-if="!isLoggedIn" class="p-text-left p-text-capitalize">
              Guest
            </div>
          </div>
          <div class="flex flex-row justify-content-center">
            <Button class="user-submit" type="submit" label="Logout" v-on:click.prevent="handleSubmit" />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";
import { Models } from "im-library";
import { SweetAlertResult } from "sweetalert2";

export default defineComponent({
  name: "Logout",
  computed: mapState(["currentUser", "isLoggedIn", "previousAppUrl"]),
  methods: {
    handleSubmit(): void {
      this.$swal
        .fire({
          icon: "warning",
          title: "Are you sure?",
          text: "Confirm logout request",
          showCancelButton: true,
          confirmButtonText: "Logout",
          reverseButtons: true
        })
        .then((result: SweetAlertResult) => {
          if (result.isConfirmed) {
            this.$store.dispatch("logoutCurrentUser").then((res: Models.CustomAlert) => {
              if (res.status === 200) {
                this.$swal
                  .fire({
                    icon: "success",
                    title: "Success",
                    text: res.message
                  })
                  .then(() => {
                    if (this.previousAppUrl) {
                      window.location.href = this.previousAppUrl;
                    } else {
                      this.$router.push({ name: "Login" });
                    }
                  });
              } else {
                this.$swal.fire({
                  icon: "error",
                  title: "Error",
                  text: res.message
                });
              }
            });
          }
        });
    },

    getUrl(item: string): string {
      const url = new URL(`../../assets/avatars/${item}`, import.meta.url);
      return url.href;
    }
  }
});
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
