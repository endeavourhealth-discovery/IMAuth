<template>
  <div class="layout-wrapper layout-static">
    <Toast />
    <ReleaseNotes v-if="!loading" :appVersion="appVersion" repositoryName="IMAuth" />
    <div v-if="loading" class="flex flex-row justify-content-center align-items-center loading-container">
      <ProgressSpinner />
    </div>
    <router-view v-else />
  </div>
</template>

<script setup lang="ts">
import { onMounted, provide, ref } from "vue";
import { useStore } from "vuex";
import ProgressSpinner from "primevue/progressspinner";
import axios from "axios";
import { Auth } from "aws-amplify";
import { useToast } from "primevue/usetoast";
import { Services, Helpers } from "im-library";
import { useRouter } from "vue-router";
const { Env } = Services;
const {
  DataTypeCheckers: { isObjectHasKeys }
} = Helpers;

setupAxiosInterceptors();
setupExternalErrorHandler();

provide("axios", axios);

const router = useRouter();
const toast = useToast();
const store = useStore();

const appVersion = __APP_VERSION__;

let loading = ref(true);

onMounted(async () => {
  loading.value = true;
  await store.dispatch("authenticateCurrentUser");
  loading.value = false;
});

function setupAxiosInterceptors() {
  axios.interceptors.request.use(async request => {
    if (store.state.isLoggedIn && Env.API && request.url?.startsWith(Env.API)) {
      if (request.headers) request.headers.Authorization = "Bearer " + (await Auth.currentSession()).getIdToken().getJwtToken();
    }
    return request;
  });

  axios.interceptors.response.use(
    response => {
      return isObjectHasKeys(response, ["data"]) ? response.data : undefined;
    },
    error => {
      if (error.response.status.toString().charAt(0) === "4") {
        if (error.response.status === 403) {
          toast.add({
            severity: "error",
            summary: "Access denied",
            detail: "Login required for " + error.config.url.substring(error.config.url.lastIndexOf("/") + 1) + "."
          });
          router.push({ name: "Login" });
        } else if (error.response.status === 401) {
          toast.add({
            severity: "error",
            summary: "Access denied",
            detail:
              "Insufficient clearance to access " +
              error.config.url.substring(error.config.url.lastIndexOf("/") + 1) +
              ". Please contact an admin to change your account security clearance if you require access to this resource."
          });
          router.push({ name: "Login" });
        } else {
          toast.add({
            severity: "warn",
            summary: "Warning",
            detail:
              "Request for " + error.config.url.substring(error.config.url.lastIndexOf("/") + 1) + " was unsuccessful. " + error.response.data.message + ".",
            life: 4000
          });
          console.warn(
            error.config.url +
              " :" +
              "\n\t" +
              "Status: " +
              error.response.data.status +
              "\n\t" +
              "Code: " +
              error.response.data.code +
              "\n\t" +
              "Timestamp: " +
              error.response.data.timestamp +
              "\n\t" +
              "Message: " +
              error.response.data.message
          );
        }
      } else {
        toast.add({
          severity: "error",
          summary: "Request error",
          detail:
            "Request for " + error.config.url.substring(error.config.url.lastIndexOf("/") + 1) + " was unsuccessful. " + error.response.data.message + ".",
          life: 4000
        });
        console.error(
          error.config.url +
            " :" +
            "\n\t" +
            "Status: " +
            error.response.data.status +
            "\n\t" +
            "Code: " +
            error.response.data.code +
            "\n\t" +
            "Timestamp: " +
            error.response.data.timestamp +
            "\n\t" +
            "Message: " +
            error.response.data.message
        );
      }
    }
  );
}

function setupExternalErrorHandler() {
  window.addEventListener("unhandledrejection", e => {
    e.preventDefault();
    console.error(e);
    if (e.reason?.response?.data?.title)
      toast.add({
        severity: "error",
        summary: e.reason.response.data.title,
        detail: e.reason.response.data.detail
      });
    else if (e.reason?.name)
      toast.add({
        severity: "error",
        summary: e.reason.name,
        detail: e.reason.message
      });
    else
      toast.add({
        severity: "error",
        summary: "An error occurred",
        detail: e.reason
      });
  });
}
</script>

<style>
body {
  overflow: hidden;
}

.loading-container {
  width: 100vw;
  height: 100vh;
}

#popup-user {
  background-color: #3b3e47 !important;
  /* bottom setting when cog is visible */
  /* bottom: calc(4rem + 45px) !important;  */
  bottom: 20px !important;
  top: unset !important;
}

@media screen and (max-width: 1439px) {
  #popup-user {
    left: 8vw !important;
  }
}

@media screen and (min-width: 1440px) {
  #popup-user {
    left: 115px !important;
  }
}

#popup-user ul li a .p-menuitem-icon {
  color: lightgray !important;
}

#popup-user ul li a .p-menuitem-text {
  color: lightgray !important;
}

#popup-user ul li:hover a .p-menuitem-icon {
  color: #3b3e47 !important;
}

#popup-user ul li:hover a .p-menuitem-text {
  color: #3b3e47 !important;
}

/* Settings specifically for dealing with 300% scaling */
/* @media (-webkit-device-pixel-ratio: 3) {
  .p-component {
    font-size: 0.7rem !important;
  }
  .p-tree .p-tree-container .p-treenode .p-treenode-content .p-tree-toggler {
    width: 1rem !important;
    height: 1rem !important;
  }

  .p-button {
    font-size: 0.7rem !important;
  }

  .p-tabview .p-tabview-nav li .p-tabview-nav-link {
    padding: 0.5rem !important;
  }

  .p-panel.p-panel-toggleable .p-panel-header {
    padding: 0rem 1rem !important;
  }

  .monaco-editor {
    font-size: 0.7rem !important;
  }

  .im-logo {
    font-size: 2em !important;
  }

  .user-icon {
    font-size: 2em !important;
  }

  .settings-icon {
    font-size: 2em !important;
  }

  @media screen and (max-width: 1439px) {
    .layout-menu-container {
      width: 8vw;
    }
  }

  @media screen and (min-width: 1440px) {
    .layout-menu-container {
      width: 115px;
    }
  }
} */

.swal2-container .swal2-popup .swal2-actions {
  justify-content: flex-end;
}

.p-toast-message-text {
  width: calc(100% - 4rem);
}

.p-toast-message-content {
  width: 100%;
}

.p-toast-detail {
  width: 100%;
  word-wrap: break-word;
}
</style>
