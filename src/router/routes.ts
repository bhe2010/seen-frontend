import * as VueRouter from "vue-router";

const Home = () => import("pages/home.vue");
const Terms = () => import("pages/terms.vue");

const routes: VueRouter.RouteRecordRaw[] = [
  { path: "/", component: Home },
  { path: "/terms", component: Terms },
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
});

export default router;
