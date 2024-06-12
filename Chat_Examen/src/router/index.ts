import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../views/HomePage.vue";
import ChatPage from "../views/ChatPage.vue";

const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    component: HomePage,
  },
  {
    path: "/chat",
    component: ChatPage,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
