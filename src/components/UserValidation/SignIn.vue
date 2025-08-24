<template>
  <v-app>
    <v-main>
      <v-container fluid class="fill-height pa-0 signin-bg">
        <v-row align="center" justify="center" style="min-height:100vh;">
          <v-col cols="12" sm="8" md="6" lg="4">
            <v-card class="pa-4" elevation="6">
              <!-- Header -->
              <div class="card-header">
                <v-avatar size="56" class="mr-3">
                  <v-icon large color="primary">mdi-login</v-icon>
                </v-avatar>
                <div>
                  <div class="title">Sign In</div>
                  <div class="subtitle">Welcome back! Please login to your account.</div>
                </div>
              </div>

              <!-- Form -->
              <v-form ref="form" v-model="valid" lazy-validation class="mt-4">
                <v-text-field
                  v-model="email"
                  label="Email"
                  prepend-icon="mdi-email"
                  :rules="[rules.required, rules.email]"
                  dense
                  outlined
                  required
                />
                <v-text-field
                  v-model="password"
                  label="Password"
                  prepend-icon="mdi-lock"
                  :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  :type="showPassword ? 'text' : 'password'"
                  @click:append="showPassword = !showPassword"
                  :rules="[rules.required]"
                  dense
                  outlined
                  required
                />

                <!-- Sign In Button -->
                <v-row class="mt-4" align="center">
                  <v-col cols="12">
                    <v-btn
                      color="primary"
                      block
                      @click="submit"
                      :disabled="!allFilled"
                    >
                      Sign In
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>

              <!-- Link to Sign Up -->
              <div class="text-center mt-3">
                <small>
                  Don't have an account?
                  <v-btn text color="primary" @click="goSignUp">Sign Up</v-btn>
                </small>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Snackbar -->
        <v-snackbar v-model="snackbar" :timeout="3000" top>
          {{ snackbarText }}
          <v-btn text color="white" @click="snackbar = false">Close</v-btn>
        </v-snackbar>

      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  name: "SignIn",
  data() {
    return {
      valid: false,
      email: "",
      password: "",
      showPassword: false,
      snackbar: false,
      snackbarText: "",
      rules: {
        required: v => !!v || "This field is required",
        email: v => /.+@.+\..+/.test(v) || "E-mail must be valid",
      },
    };
  },
  computed: {
    allFilled() {
      return this.email && this.password;
    }
  },
  methods: {
    goSignUp() {
      this.$router.push({ name: "SignUp" });
    },
    async submit() {
      const form = this.$refs.form;
      if (!form) return;

      form.validate();

      if (!this.valid) {
        this.snackbarText = "Please fill in all fields correctly.";
        this.snackbar = true;
        return;
      }

      try {
        const { data } = await axios.post("/api/signin", {
          email: this.email,
          password: this.password,
        });
        console.log(data);

        if (data && data.success && data.user) {
          // show success message
          this.snackbarText = data.message || "Successfully signed in!";
          this.snackbar = true;

          // clear form
          this.email = "";
          this.password = "";
          this.showPassword = false;
          form.resetValidation();

          // navigate to UserDashboard with email & name
          this.$router.push({ 
            name: "UserDashboard", 
            params: { 
              userEmail: data.user.email, 
              userName: data.user.name 
            } 
          });
        } else {
          this.snackbarText = data?.message || "Invalid email or password.";
          this.snackbar = true;
        }
      } catch (err) {
        this.snackbarText =
          err.response?.data?.message || "Sign in failed. Please try again.";
        this.snackbar = true;
      }
    },
  },
};
</script>

<style scoped>
.signin-bg {
  background: linear-gradient(180deg, #f7fbfa 0%, #eef6f4 100%);
}
.card-header {
  display: flex;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 1px solid #f1f5f4;
}
.title {
  font-weight: 700;
  font-size: 1.05rem;
}
.subtitle {
  color: #6b7b7a;
  font-size: 0.85rem;
  margin-top: 2px;
}
@media (max-width: 600px) {
  .card-header .title {
    font-size: 1rem;
  }
}
</style>
