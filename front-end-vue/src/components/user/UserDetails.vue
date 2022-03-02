<template>
  <div class="flex flex-row align-items-center">
    <Card class="flex flex-column justify-content-sm-around align-items-center user-details-card">
      <template #header>
        <img id="selected-avatar" :src="getUrl(currentUser.avatar)" alt="avatar icon" />
      </template>
      <template #title>
        My account details
      </template>
      <template #content>
        <div v-if="isLoggedIn" class="p-fluid flex flex-column justify-content-start user-details-form">
          <div class="field">
            <label for="username">Username</label>
            <InputText id="username" type="text" :value="currentUser.username" disabled />
          </div>
          <div class="field">
            <label for="firstName">First name</label>
            <InputText id="firstName" type="text" :value="currentUser.firstName" disabled />
          </div>
          <div class="field">
            <label for="lastName">Last name</label>
            <InputText id="lastName" type="text" :value="currentUser.lastName" disabled />
          </div>
          <div class="field">
            <label for="email">Email address</label>
            <InputText id="email" type="text" :value="currentUser.email" disabled />
          </div>
          <div class="flex flex-row justify-content-center">
            <Button class="user-edit" type="submit" label="Edit" v-on:click.prevent="handleEditClicked" />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";

export default defineComponent({
  name: "UserDetails",
  components: {},
  computed: mapState(["currentUser", "isLoggedIn"]),
  methods: {
    handleEditClicked(): void {
      this.$router.push({ name: "UserEdit" });
    },

    getUrl(item: string): string {
      const url = new URL(`../../assets/avatars/${item}`, import.meta.url);
      console.log(url.href);
      return url.href;
    }
  }
});
</script>

<style scoped>
.user-edit {
  width: fit-content !important;
}

.user-details-form {
  width: 32em;
}

.user-details-card {
  padding: 0 2em;
}

#selected-avatar {
  margin: 1.5rem;
  width: 10rem;
  border: 1px solid lightgray;
  border-radius: 50%;
}
</style>
