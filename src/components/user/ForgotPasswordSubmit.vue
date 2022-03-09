<template>
  <div class="flex flex-row align-items-center">
    <Card class="flex flex-column justify-content-sm-around align-items-center recovery-card">
      <template #header>
        <i class="pi pi-fw pi-user icon-header" aria-hidden="true" />
      </template>
      <template #title> Account Recovery: <br /><br />Submit Password Reset Code </template>
      <template #content>
        <div class="p-fluid recovery-form">
          <div class="field">
            <label for="fieldUsername">Username</label>
            <InputText id="fieldUsername" type="text" v-model="username" :placeholder="registeredUsername" />
          </div>
          <div class="field">
            <label for="fieldCode">Confirmation code</label>
            <div class="flex flex-row align-items-center">
              <InputText id="fieldCode" type="password" v-model="code" />
              <i v-if="codeVerified" class="pi pi-check-circle" style="color: #439446; font-size: 2em" aria-hidden="true" />
              <i v-if="!codeVerified && code !== ''" class="pi pi-times-circle" style="color: #e60017; font-size: 2em" aria-hidden="true" />
            </div>
            <small id="code-help">Your 6-digit code should arrive by email from<br />no-reply@verificationemail.com</small>
          </div>
          <div class="field">
            <label for="fieldPassword1">New Password</label>
            <InputText id="fieldPassword1" type="password" aria-describedby="password-help" v-model="newPassword1" />
            <InlineMessage v-if="passwordStrength === 'strong'" severity="success">Password Strength: Strong</InlineMessage>
            <InlineMessage v-if="passwordStrength === 'medium'" severity="success">Password Strength: Medium</InlineMessage>
            <InlineMessage v-if="passwordStrength === 'weak'" severity="warn">Password Strength: Weak</InlineMessage>
            <InlineMessage v-if="passwordStrength === 'fail' && newPassword1 !== ''" severity="error">Invalid Password</InlineMessage>
            <small id="password-help"
              >Password min length 8 characters. Improve password strength with a mixture of UPPERCASE, lowercase, numbers and special characters
              [!@#$%^&*].</small
            >
          </div>
          <div class="field">
            <label for="fieldPassword2">Confirm New Password</label>
            <InputText id="fieldPassword2" type="password" v-model="newPassword2" v-on:blur="setShowPassword2Notice" />
            <InlineMessage v-if="showPassword2Notice" severity="error">Passwords do not match!</InlineMessage>
          </div>
          <div class="flex flex-row justify-content-center">
            <Button class="user-submit" type="submit" label="Reset Password" v-on:click.prevent="handleSubmit" />
          </div>
        </div>
      </template>
      <template #footer>
        <small>Request a new code <a id="password-submit-link" class="footer-link" @click="$router.push({ name: 'ForgotPasswordSubmit' })">here</a></small>
        <br />
        <br />
        <small>If you have forgotten your username, please contact an admin</small>
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";
import AuthService from "@/services/AuthService";
import { Helpers, Enums } from "im-library";
import { SweetAlertResult } from "sweetalert2";
const {
  UserMethods: { verifyPasswordsMatch, checkPasswordStrength }
} = Helpers;
const { PasswordStrength } = Enums;

export default defineComponent({
  name: "ForgotPasswordSubmit",
  computed: mapState(["registeredUsername"]),
  watch: {
    code() {
      this.verifyCode();
    },
    newPassword1(newValue) {
      this.passwordStrength = checkPasswordStrength(newValue);
    },
    newPassword2(newValue) {
      this.passwordsMatch = verifyPasswordsMatch(this.newPassword1, newValue);
    }
  },
  data() {
    return {
      code: "",
      codeVerified: false,
      username: "",
      newPassword1: "",
      newPassword2: "",
      passwordStrength: PasswordStrength.fail as Enums.PasswordStrength,
      passwordsMatch: false,
      showPassword2Notice: false
    };
  },
  mounted() {
    if (this.registeredUsername && this.registeredUsername !== "") {
      this.username = this.registeredUsername;
    }
  },
  methods: {
    setShowPassword2Notice(): void {
      this.showPassword2Notice = this.passwordsMatch ? false : true;
    },

    verifyCode(): void {
      this.codeVerified = /^(?=.{6,})/.test(this.code);
    },

    handleSubmit(): void {
      if (this.codeVerified && this.username !== "" && this.passwordsMatch && this.passwordStrength !== PasswordStrength.fail) {
        AuthService.forgotPasswordSubmit(this.username, this.code, this.newPassword1).then(res => {
          if (res.status === 200) {
            this.$swal
              .fire({
                icon: "success",
                title: "Success",
                text: "Password successfully reset",
                confirmButtonText: "Continue"
              })
              .then(() => {
                this.$router.push({ name: "Login" });
              });
          } else if (res.status === 403) {
            this.$swal
              .fire({
                icon: "error",
                title: "Code Expired",
                text: "Password reset code has expired. Please request a new code",
                showCancelButton: true,
                confirmButtonText: "Request new code"
              })
              .then((result: SweetAlertResult) => {
                if (result.isConfirmed) {
                  this.$router.push({ name: "ForgotPassword" });
                }
              });
          } else {
            this.$swal.fire({
              icon: "error",
              title: "Error",
              text: res.message + ". Check input data."
            });
          }
        });
      }
    }
  }
});
</script>

<style scoped>
.recovery-card {
  padding: 0 2em;
}

.user-submit {
  width: fit-content !important;
}

.recovery-form {
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
