import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import PrimeVue from "primevue/config";

// Font Awesome
import { library, dom } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";

dom.watch();

library.add(fas, far);

import "primevue/resources/themes/saga-blue/theme.css"; //theme

// import "primevue/resources/themes/md-light-indigo/theme.css"

import "primevue/resources/primevue.min.css"; //core css
import "primeicons/primeicons.css"; //icons
import "primeflex/primeflex.css";
import "./assets/layout/layout.scss";
import "./assets/layout/flags/flags.css";

// PrimeVue Components
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import OverlayPanel from "primevue/overlaypanel";
import ProgressSpinner from "primevue/progressspinner";
import ToastService from "primevue/toastservice";
import Toast from "primevue/toast";
import InlineMessage from "primevue/inlinemessage";
import SelectButton from "primevue/selectbutton";
import Dialog from "primevue/dialog";

import { Amplify, Auth } from "aws-amplify";
import awsconfig from "./aws-exports";
import axios from "axios";

import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

// IMLibrary imports
import "im-library/dist/style.css";
import { Helpers, Services } from "im-library";
const {
  DataTypeCheckers: { isObjectHasKeys }
} = Helpers;
const { Env } = Services;

Amplify.configure(awsconfig);
Auth.configure(awsconfig);

const app = createApp(App)
  .use(store)
  .use(router)
  .use(PrimeVue, { ripple: true })
  .use(ToastService)
  .use(VueSweetalert2)
  .component("Card", Card)
  .component("ProgressSpinner", ProgressSpinner)
  .component("InputText", InputText)
  .component("Button", Button)
  .component("OverlayPanel", OverlayPanel)
  .component("Toast", Toast)
  .component("InlineMessage", InlineMessage)
  .component("SelectButton", SelectButton)
  .component("Dialog", Dialog);

const vm = app.mount("#app");

axios.interceptors.request.use(async request => {
  if (store.state.isLoggedIn && Env.API && request.url?.startsWith(Env.API)) {
    request.headers.Authorization = "Bearer " + (await Auth.currentSession()).getIdToken().getJwtToken();
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
        vm.$toast.add({
          severity: "error",
          summary: "Access denied",
          detail: "Login required for " + error.config.url.substring(error.config.url.lastIndexOf("/") + 1) + "."
        });
        vm.$router.push({ name: "Login" });
      } else if (error.response.status === 401) {
        vm.$toast.add({
          severity: "error",
          summary: "Access denied",
          detail:
            "Insufficient clearance to access " +
            error.config.url.substring(error.config.url.lastIndexOf("/") + 1) +
            ". Please contact an admin to change your account security clearance if you require access to this resource."
        });
        vm.$router.push({ name: "Login" });
      } else {
        vm.$toast.add({
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
      vm.$toast.add({
        severity: "error",
        summary: "Request error",
        detail: "Request for " + error.config.url.substring(error.config.url.lastIndexOf("/") + 1) + " was unsuccessful. " + error.response.data.message + ".",
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
