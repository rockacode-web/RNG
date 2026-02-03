import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
  {
    path: "/game",
    name: "Game",
    component: () => import("../views/Game.vue"),
  },
];

const router = createRouter({
  // ✅ Vite (Vue 3) correct base history (prevents blank screen)
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;

