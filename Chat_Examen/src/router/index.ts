import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import HomePage from "../views/HomePage.vue";
import ChatPage from "@/views/ChatPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/",
    redirect: "/chat",
  },
  {
    path: "/chat",
    name: "Chat",
    component: ChatPage,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_DATABASEURL),
  routes,
});

export default router;
