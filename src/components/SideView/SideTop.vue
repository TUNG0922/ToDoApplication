<template>
  <v-app-bar app color="primary" dark>
    <!-- Logo / Title -->
    <v-toolbar-title class="mr-6">
      Project Task Tracker
    </v-toolbar-title>

    <!-- Navigation links -->
    <v-btn text @click="goHome">
      Home
    </v-btn>
    <v-btn text to="/calendar" exact>
      Calendar
    </v-btn>

    <v-spacer></v-spacer> <!-- pushes Sign Out to the right -->

    <!-- Sign Out button -->
    <v-btn text color="red lighten-1" @click="signOut">
      Sign Out
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {
  name: "SideTop",
  methods: {
    goHome() {
      const raw = localStorage.getItem("authUser");
      if (raw) {
        try {
          const user = JSON.parse(raw);
          if (user && user.email) {
            if (this.$route.name !== "UserDashboard") {
              this.$router.push({ name: "UserDashboard" });
            }
            return;
          }
        } catch (e) {
          localStorage.removeItem("authUser");
        }
      }
      if (this.$route.name !== "SignIn") {
        this.$router.push({ name: "SignIn" });
      }
    },

    signOut() {
      localStorage.removeItem("authUser");
      localStorage.removeItem("authToken"); 
      this.$router.replace({ name: "SignIn" });
    }
  }
}
</script>

<style scoped>
.v-btn--active {
  border-bottom: 2px solid white;
}
</style>
