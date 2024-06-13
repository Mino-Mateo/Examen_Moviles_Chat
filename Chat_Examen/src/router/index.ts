import { createRouter, createWebHistory } from "@ionic/vue-router";
import LoginPage from "@/views/LoginPage.vue";
import RegisterPage from "@/views/RegisterPage.vue";
import ChatPage from "@/views/ChatPage.vue";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterPage,
  },
  {
    path: "/chat",
    name: "Chat",
    component: ChatPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
