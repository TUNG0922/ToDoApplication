<template>
  <v-app>
    <SideTop />

    <v-main>
      <v-container>
        <div v-if="loading" class="text-center py-8">
          <v-progress-circular indeterminate />
          <div class="mt-2">Loading...</div>
        </div>

        <div v-else-if="error" class="text-center py-8">
          <v-icon large color="error">mdi-alert-circle</v-icon>
          <div class="mt-2">{{ error }}</div>
          <v-btn class="mt-4" color="primary" @click="goSignIn">Go to Sign In</v-btn>
        </div>

        <div v-else>
          <h1>User Dashboard</h1>
          <p class="mb-4">Welcome, <strong>{{ user.name || user.email }}</strong>!</p>

          <v-card class="mb-6" outlined>
            <v-card-title>User Info</v-card-title>
            <v-card-text>
              <div><strong>Name:</strong> {{ user.name || '-' }}</div>
              <div><strong>Email:</strong> {{ user.email }}</div>
            </v-card-text>
          </v-card>

          <v-card outlined>
            <v-card-title>Your Stuff</v-card-title>
            <v-card-text>
              Content for <strong>{{ user.email }}</strong> only.
            </v-card-text>
          </v-card>

          <v-btn class="mt-6" color="error" @click="signOut">Sign Out</v-btn>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import SideTop from "../SideView/SideTop.vue";

export default {
  name: "UserDashboard",
  components: { SideTop },

  props: {
    userEmail: { type: String, required: true },
    userName: { type: String, required: true }
  },

  data() {
    return {
      user: {
        email: this.userEmail,
        name: this.userName
      },
      loading: false,
      error: null
    };
  },

  methods: {
    signOut() {
      localStorage.removeItem("authUser");
      localStorage.removeItem("authToken"); // if using tokens
      this.$router.replace({ name: "SignIn" });
    },

    goSignIn() {
      this.$router.replace({ name: "SignIn" });
    }
  }
};
</script>

<style scoped>
/* minimal styling */
</style>
