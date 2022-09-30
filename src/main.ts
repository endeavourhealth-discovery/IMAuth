import { createApp, Plugin } from "vue";
import { ComponentPublicInstance } from "@vue/runtime-core";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import PrimeVue from "primevue/config";
import { worker } from "./mocks/browser";

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
import StyleClass from "primevue/styleclass";

import { Amplify, Auth } from "aws-amplify";
import awsconfig from "./aws-exports";
import axios from "axios";

import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

// IMLibrary imports
import "im-library/dist/style.css";
import IMLibrary, { Helpers, Services } from "im-library";
const {
  DataTypeCheckers: { isObjectHasKeys }
} = Helpers;
const { Env } = Services;

Amplify.configure(awsconfig);
Auth.configure(awsconfig);

// msw initialising
if (import.meta.env.MODE === "mock") {
  worker.start();
}

const app = createApp(App)
  .use(store)
  .use(router)
  .use(IMLibrary.install as Plugin, { store })
  .use(PrimeVue, { ripple: true })
  .use(ToastService)
  .use(VueSweetalert2)
  .directive("styleclass", StyleClass)
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

// Vue application exceptions
app.config.errorHandler = (err: unknown, _instance: ComponentPublicInstance | null, info: string) => {
  console.error(err);
  _instance?.$toast.add({
    severity: "error",
    summary: info,
    detail: err
  });
};
