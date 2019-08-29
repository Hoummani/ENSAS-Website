import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";

//--->Import views

import Calendar from "./views/Calendar.vue";

import About from "./views/About.vue";
import Login from "./views/Login.vue";
//import Register from "./views/Register.vue";

import QuickRegister from "./views/QuickRegister.vue";
Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/calendar",
      name: "calendar",
      component: Calendar
    },
    {
      path: "/about",
      name: "about",
      component: About
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/register",
      name: "register",
      component: QuickRegister
    }
  ]
});
