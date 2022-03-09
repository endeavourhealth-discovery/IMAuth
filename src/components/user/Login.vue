<template>
  <div class="flex flex-row align-items-center">
    <Card class="flex flex-column justify-content-sm-around align-items-center login-card">
      <template #header>
        <i class="fa fa-fw fa-users icon-header" aria-hidden="true" />
      </template>
      <template #title>
        Login
      </template>
      <template #content>
        <div class="p-fluid login-form">
          <div class="field">
            <label for="fieldUsername">Username</label>
            <InputText id="fieldUsername" type="text" v-model="username" :placeholder="username" />
          </div>
          <div class="field">
            <label for="fieldPassword">Password</label>
            <InputText id="fieldPassword" type="password" v-model="password" @keyup="checkKey" />
          </div>
          <div class="flex flex-row justify-content-center">
            <Button class="user-submit" type="submit" label="Login" v-on:click.prevent="handleSubmit" />
          </div>
        </div>
      </template>
      <template #footer>
        <small>Don't have an account yet? <a id="register-link" class="footer-link" @click="$router.push({ name: 'Register' })">Register here</a></small>
        <br />
        <br />
        <small
          >Already received a confirmation code? <a id="code-link" class="footer-link" @click="$router.push({ name: 'ConfirmCode' })">Add it here</a></small
        >
        <br />
        <br />
        <small
          >Forgot your password or username? <br /><a id="recover-link" class="footer-link" @click="$router.push({ name: 'ForgotPassword' })">
            Recover account</a
          ></small
        >
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";
import AuthService from "@/services/AuthService";
import { Constants } from "im-library";
import { SweetAlertResult } from "sweetalert2";
const { Avatars } = Constants;

export default defineComponent({
  name: "Login",
  computed: mapState(["registeredUsername", "previousAppUrl"]),
  data() {
    return {
      username: "",
      password: ""
    };
  },
  mounted() {
    if (this.registeredUsername && this.registeredUsername !== "") {
      this.username = this.registeredUsername;
    }
  },
  methods: {
    handleSubmit(): void {
      AuthService.signIn(this.username, this.password)
        .then(res => {
          if (res.status === 200 && res.user) {
            const loggedInUser = res.user;
            // check if avatar exists and replace lagacy images with default avatar on signin
            const result = Avatars.find((avatar: string) => avatar === loggedInUser.avatar);
            if (!result) {
              loggedInUser.avatar = Avatars[0];
            }
            this.$store.commit("updateCurrentUser", loggedInUser);
            this.$store.commit("updateRegisteredUsername", null);
            this.$store.commit("updateIsLoggedIn", true);
            this.$swal
              .fire({
                icon: "success",
                title: "Success",
                text: "Login successful"
              })
              .then(() => {
                if (this.previousAppUrl) {
                  window.location.href = this.previousAppUrl;
                } else {
                  this.$router.push({ name: "UserDetails" });
                }
              });
          } else if (res.status === 401) {
            this.$swal
              .fire({
                icon: "warning",
                title: "User Unconfirmed",
                text: "Account has not been confirmed. Please confirm account to continue.",
                showCloseButton: true,
                showCancelButton: true,
                confirmButtonText: "Confirm Account"
              })
              .then((result: SweetAlertResult) => {
                if (result.isConfirmed) {
                  this.$store.commit("updateRegisteredUsername", this.username);
                  this.$router.push({ name: "ConfirmCode" });
                }
              });
          } else {
            this.$swal.fire({
              icon: "error",
              title: "Error",
              text: res.message,
              confirmButtonText: "Close"
            });
          }
        })
        .catch(err => {
          console.error(err);
          this.$swal.fire({
            icon: "error",
            title: "Error",
            text: "Authentication error",
            confirmButtonText: "Close"
          });
        });
    },

    checkKey(event: any): void {
      if (event.keyCode === 13) {
        this.handleSubmit();
      }
    }
  }
});
</script>

<style scoped>
.login-card {
  padding: 0 2em;
}

.user-submit {
  width: fit-content !important;
}

.login-form {
  max-width: 25em;
}

.footer-link:hover {
  cursor: pointer;
}

.icon-header {
  font-size: 5rem;
  margin-top: 1em;
}
</style>