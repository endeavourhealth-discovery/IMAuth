import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import User from "../views/User.vue";
import Login from "../components/user/Login.vue";
import Register from "../components/user/Register.vue";
import UserDetails from "../components/user/UserDetails.vue";
import UserEdit from "../components/user/UserEdit.vue";
import PasswordEdit from "../components/user/PasswordEdit.vue";
import ConfirmCode from "../components/user/ConfirmCode.vue";
import Logout from "../components/user/Logout.vue";
import ForgotPassword from "../components/user/ForgotPassword.vue";
import ForgotPasswordSubmit from "../components/user/ForgotPasswordSubmit.vue";
import store from "@/store/index";
import { nextTick } from "vue";
import { Helpers } from "im-library";
const {
  RouterGuards: { checkAuth }
} = Helpers;

const APP_TITLE = "IMAuth";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "User",
    component: User,
    redirect: { name: "Login" },
    children: [
      {
        path: "login:returnUrl?",
        name: "Login",
        component: Login
      },
      {
        path: "confirm-code:returnUrl?",
        name: "ConfirmCode",
        component: ConfirmCode
      },
      {
        path: "register:returnUrl?",
        name: "Register",
        component: Register
      },
      {
        path: "my-account:returnUrl?",
        name: "UserDetails",
        component: UserDetails,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: "my-account/edit:returnUrl?",
        name: "UserEdit",
        component: UserEdit,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: "my-account/password-edit:returnUrl?",
        name: "PasswordEdit",
        component: PasswordEdit,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: "logout:returnUrl?",
        name: "Logout",
        component: Logout
      },
      {
        path: "password-recovery:returnUrl?",
        name: "ForgotPassword",
        component: ForgotPassword
      },
      {
        path: "password-recovery/submit:returnUrl?",
        name: "ForgotPasswordSubmit",
        component: ForgotPasswordSubmit
      }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach(async (to, from) => {
  if (to.query.returnUrl) {
    store.commit("updatePreviousAppUrl", to.query.returnUrl);
  }
  if (to.matched.some((record: any) => record.meta.requiresAuth)) {
    const res = await store.dispatch("authenticateCurrentUser");
    console.log("auth guard user authenticated: " + res.authenticated);
    if (!res.authenticated) {
      console.log("redirecting to login");
      return { path: "/login" };
    }
  }
});

router.afterEach(to => {
  nextTick(() => {
    document.title = (to.meta.title as string) || APP_TITLE;
  });
});

export default router;
