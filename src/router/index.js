import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [{
    path: "/",
    redirect: '/login',
  },
  {
    path: "/home",
    name: "Home",
    component: () => import('@/views/Home.vue'),
    children: [
      {
        path: "/filePage",
        name: "FilePage",
        component: () => import('@/components/FilePage/Index.vue')
      },
      {
        path: "/other",
        name: "Other",
        component: () => import('@/components/FilePage/Other.vue')
      },
      {
        path: "/picture",
        name: "Picture",
        component: () => import('@/components/FilePage/Picture.vue')
      },
      {
        path: "/share",
        name: "Share",
        component: () => import('@/components/Share.vue')
      }
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: () => import('@/views/Login.vue'),
  },
  // {
  //   path: "/fileUpload",
  //   name: "FileUpload",
  //   component: () => import('@/components/FileUpload/index.vue')
  // }
];

const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
  routes,
});

export default router;