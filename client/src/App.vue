<template>
  <v-app class="grey lighten-4">
    <Navbar />
    <v-content>
      <router-view></router-view>
      <Footer />
    </v-content>
  </v-app>
</template>

<script>
import Navbar from "@/components/core/Navbar";
import Footer from "@/components/core/Footer";
import store from "./store";
export default {
  name: "App",
  components: {
    Navbar,
    Footer
  },

  data() {
    return {
      //
    };
  },
  store
};
</script>

<style lang="scss" scoped></style>
