<template>
  <div v-if="currentUser" class="flex flex-row align-items-center">
    <Card class="flex flex-column justify-content-sm-around align-items-center password-edit-card">
      <template #header>
        <img id="user-icon" class="avatar-icon" :src="getUrl(currentUser.avatar)" alt="avatar icon" aria-haspopup="true" aria-controls="overlay_menu" />
      </template>
      <template #title>
        Change password
      </template>
      <template #content>
        <div class="p-fluid flex flex-column justify-content-start password-edit-form">
          <div v-if="currentUser.username" class="field">
            <label for="userName">Username</label>
            <InputText class="p-text-capitalize" id="username" type="text" :value="currentUser.username" disabled />
          </div>
          <div class="field">
            <label for="passwordOld">Current password</label>
            <InputText id="passwordOld" type="password" v-model="passwordOld" />
          </div>
          <div class="field">
            <label for="passwordNew1">New password</label>
            <InputText id="passwordNew1" type="password" v-model="passwordNew1" />
            <InlineMessage v-if="passwordStrength === 'strong'" severity="success">
              Password strength: Strong
            </InlineMessage>
            <InlineMessage v-if="passwordStrength === 'medium'" severity="success">
              Password strength: Medium
            </InlineMessage>
            <InlineMessage v-if="passwordStrength === 'weak'" severity="warn">
              Password strength: Weak
            </InlineMessage>
            <InlineMessage v-if="passwordStrength === 'fail' && passwordNew1 !== ''" severity="error">
              Invalid password
            </InlineMessage>
            <small id="password-help">
              Password must be a minimum length of 8 characters. Improve password strength with a mixture of UPPERCASE, lowercase, numbers and special
              characters [!@#$%^&*].
            </small>
          </div>
          <div class="field">
            <label for="passwordNew2">Confirm new password</label>
            <InputText id="passwordNew2" type="password" v-model="passwordNew2" v-on:blur="setShowPassword2Message" @keyup="checkKey" />
            <InlineMessage v-if="showPassword2Message" severity="error">
              New passwords do not match!
            </InlineMessage>
          </div>
          <div class="flex flex-row justify-content-center">
            <Button v-if="setButtonDisabled()" class="user-edit" type="submit" label="Change password" disabled v-on:click.prevent="handleEditSubmit" />
            <Button v-else class="user-edit" type="submit" label="Change password" v-on:click.prevent="handleEditSubmit" />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";
import AuthService from "@/services/AuthService";
import { Helpers, Enums } from "im-library";
const {
  UserMethods: { verifyPasswordsMatch, checkPasswordStrength }
} = Helpers;
const { PasswordStrength } = Enums;

export default defineComponent({
  name: "PasswordEdit",
  components: {},
  computed: mapState(["currentUser", "previousAppUrl"]),
  watch: {
    passwordOld(newValue) {
      this.passwordStrengthOld = checkPasswordStrength(newValue);
    },
    passwordNew1(newValue) {
      this.passwordStrength = checkPasswordStrength(newValue);
    },
    passwordNew2(newValue) {
      this.passwordsMatch = verifyPasswordsMatch(this.passwordNew1, newValue);
    }
  },
  data() {
    return {
      passwordOld: "",
      passwordNew1: "",
      passwordNew2: "",
      passwordsMatch: false,
      passwordStrength: PasswordStrength.fail as Enums.PasswordStrength,
      passwordStrengthOld: PasswordStrength.fail as Enums.PasswordStrength,
      showPassword2Message: false
    };
  },
  methods: {
    setShowPassword2Message(): void {
      this.showPassword2Message = this.passwordsMatch ? false : true;
    },

    handleEditSubmit(): void {
      if (
        this.passwordsMatch &&
        this.passwordStrength !== PasswordStrength.fail &&
        this.passwordStrengthOld !== PasswordStrength.fail &&
        this.passwordDifferentFromOriginal()
      ) {
        AuthService.changePassword(this.passwordOld, this.passwordNew1).then(res => {
          if (res.status === 200) {
            this.$swal
              .fire({
                icon: "success",
                title: "Success",
                text: "Password successfully updated"
              })
              .then(() => {
                if (this.previousAppUrl) {
                  window.location.href = this.previousAppUrl;
                } else {
                  this.$router.push({ name: "UserDetails" });
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
      } else if (!this.passwordDifferentFromOriginal()) {
        this.$swal.fire({
          icon: "error",
          title: "Error",
          text: "New password can not be the same as the current password."
        });
      } else {
        this.$swal.fire({
          icon: "error",
          title: "Error",
          text: "Error updating password. Authentication error or new passwords do not match."
        });
      }
    },

    passwordDifferentFromOriginal(): boolean {
      return this.passwordOld !== this.passwordNew1 ? true : false;
    },

    getUrl(item: string): string {
      const url = new URL(`../../assets/avatars/${item}`, import.meta.url);
      return url.href;
    },

    checkKey(event: any): void {
      if (event.keyCode === 13) {
        this.handleEditSubmit();
      }
    },

    setButtonDisabled(): boolean {
      if (this.passwordStrength !== PasswordStrength.fail && this.passwordsMatch && this.passwordOld !== "") {
        return false;
      } else {
        return true;
      }
    }
  }
});
</script>

<style scoped>
.password-edit-card {
  padding: 0 2em;
}

.user-edit {
  width: fit-content !important;
}

.password-edit-form {
  max-width: 32em;
}

.avatar-icon {
  margin-block-start: 0.5rem;
  width: 10rem;
  border: 1px solid lightgray;
  border-radius: 50%;
}
</style>
