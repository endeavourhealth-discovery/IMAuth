<template>
  <div class="flex flex-row align-items-center">
    <Card class="flex flex-column justify-content-sm-around align-items-center confirm-card">
      <template #header>
        <i class="fa-solid fa-key icon-header" aria-hidden="true" />
      </template>
      <template #title>
        Confirmation Code
      </template>
      <template #content>
        <div class="p-fluid code-form">
          <div class="field">
            <label for="fieldUsername">Username</label>
            <InputText id="fieldUsername" type="text" v-model="username" :placeholder="username" />
          </div>
          <div class="field">
            <label for="fieldCode">Confirmation code</label>
            <div class="flex flex-row align-items-center">
              <InputText id="fieldCode" type="password" v-model="code" />
              <i v-if="codeVerified" class="pi pi-check-circle password-check" aria-hidden="true" />
              <i v-if="!codeVerified && code !== ''" class="pi pi-times-circle password-times" aria-hidden="true" />
            </div>
            <small id="code-help">Your 6-digit code should arrive by email from<br />no-reply@verificationemail.com</small>
          </div>
          <div class="flex flex-row justify-content-center">
            <Button class="user-submit" type="submit" label="Submit" v-on:click.prevent="handleSubmit" />
          </div>
        </div>
      </template>
      <template #footer>
        <small
          >Not received a code? <br /><Button
            class="p-button-secondary p-button-sm code-request"
            type="submit"
            label="Request a new code"
            v-on:click.prevent="showDialog = true"
        /></small>
      </template>
    </Card>
  </div>
  <Dialog v-model:visible="showDialog" header="Request new code" :modal="true" :style="{ width: '40vw' }">
    <div class="dialog-container">
      <div class="flex flex-column">
        <label for="dialog-username">Enter your username</label>
        <InputText id="dialog-username" type="text" v-model="username" :class="usernameInvalid && 'invalid'" />
        <small v-if="usernameInvalid" class="validate-error">Username is required.</small>
      </div>
    </div>
    <template #footer>
      <Button type="submit" label="Request a new code" v-on:click.prevent="requestCode" />
    </template>
  </Dialog>
</template>

<script lang="ts">
import { mapState } from "vuex";
import AuthService from "@/services/AuthService";
import { defineComponent } from "vue";

export default defineComponent({
  name: "ConfirmCode",
  computed: mapState(["registeredUsername"]),
  watch: {
    code() {
      this.verifyCode();
    },
    username(newValue) {
      if (newValue) this.usernameInvalid = false;
    }
  },
  data() {
    return {
      code: "",
      codeVerified: false,
      username: "",
      showDialog: false,
      usernameInvalid: false
    };
  },
  mounted() {
    if (this.registeredUsername && this.registeredUsername !== "") {
      this.username = this.registeredUsername;
    }
  },
  methods: {
    verifyCode() {
      this.codeVerified = /^(?=.{6,})/.test(this.code);
    },

    handleSubmit() {
      if (this.codeVerified && this.username !== "") {
        AuthService.confirmRegister(this.username, this.code)
          .then(res => {
            if (res.status === 200) {
              this.$swal
                .fire({
                  icon: "success",
                  title: "Success",
                  text: res.message,
                  confirmButtonText: "Login"
                })
                .then(() => {
                  this.$store.commit("updateRegisteredUsername", this.username);
                  this.$router.push({ name: "Login" });
                });
            } else {
              this.$swal.fire({
                icon: "error",
                title: "Error",
                text: res.message
              });
            }
          })
          .catch(err => {
            console.error(err);
            this.$swal.fire({
              icon: "error",
              title: "Error",
              text: "Auth Service Error"
            });
          });
      } else {
        this.$swal.fire({
          icon: "warning",
          title: "Invalid Credentials",
          text: "Username or Confirmation Code incorrect."
        });
      }
    },

    requestCode() {
      if (this.username) {
        this.showDialog = false;
        AuthService.resendConfirmationCode(this.username)
          .then(res => {
            if (res.status === 200) {
              this.$swal.fire({
                icon: "success",
                title: "Success",
                text: "Code has been resent to email for: " + this.username
              });
            } else {
              this.$swal.fire({
                icon: "error",
                title: "Error",
                text: "Code resending failed. Please check your username is correct."
              });
            }
          })
          .catch(err => {
            console.error(err);
            this.$swal.fire({
              icon: "error",
              title: "Error",
              text: "Internal application error"
            });
          });
      } else if (this.showDialog === false) {
        this.showDialog = true;
      } else {
        this.usernameInvalid = true;
      }
    }
  }
});
</script>

<style scoped>
.confirm-card {
  padding: 0 2em;
}

.user-submit {
  width: fit-content !important;
}

.code-form {
  max-width: 25em;
}

.icon-header {
  font-size: 5rem;
  margin-top: 1em;
}

.password-check {
  color: #439446;
  font-size: 2em;
}

.password-times {
  color: #e60017;
  font-size: 2em;
}

.invalid {
  border-color: #e24c4c;
}

.validate-error {
  color: #e24c4c;
  font-size: 0.8rem;
  padding: 0 0 0.25rem 0;
}
</style>
