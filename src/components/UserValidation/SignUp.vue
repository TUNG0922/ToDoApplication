<template>
  <v-app>
    <v-main>
      <v-container fluid class="fill-height pa-0 signup-bg">
        <v-row align="center" justify="center" style="min-height:100vh;">
          <v-col cols="12" sm="8" md="6" lg="4">
            <v-card class="pa-4" elevation="6">
              <div class="card-header">
                <v-avatar size="56" class="mr-3">
                  <v-icon large color="primary">mdi-account-circle</v-icon>
                </v-avatar>
                <div>
                  <div class="title">Create your account</div>
                  <div class="subtitle">Join ToDo App — manage tasks smarter</div>
                </div>
              </div>

              <v-form ref="form" v-model="valid" lazy-validation class="mt-4">
                <v-text-field
                  v-model="name"
                  label="Full name"
                  prepend-icon="mdi-account"
                  :rules="[rules.required]"
                  dense
                  outlined
                  required
                />
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
                  :rules="[rules.required, rules.min]"
                  dense
                  outlined
                  required
                />

                <!-- Terms Checkbox -->
                <v-checkbox
                  v-model="agree"
                  :rules="[v => !!v || 'You must accept Terms & Privacy']"
                  class="mt-0"
                  required
                  label="I agree to the Terms & Privacy"
                />

                <!-- Terms & Privacy link -->
                <div class="mt-1 mb-3">
                  <v-btn text small color="primary" @click="openTerms">
                    Read Terms & Privacy
                  </v-btn>
                </div>

                <v-row class="mt-4" align="center">
                  <v-col cols="12">
                    <v-btn 
                      color="primary" 
                      block 
                      @click="submit"
                      :disabled="!allFilled"
                    >
                      Sign Up
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>

              <!-- Sign In link -->
              <div class="text-center mt-3">
                <small>
                  Already have an account?
                  <v-btn text color="primary" @click="goSignIn">Sign In</v-btn>
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

        <!-- Terms Dialog -->
        <TermsDialog v-model="termsDialog" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import TermsDialog from "@/components/TermsPrivacy/TermsDialog.vue";
import axios from "axios";

export default {
  name: "SignUp",
  components: { TermsDialog },
  data() {
    return {
      valid: false,
      name: "",
      email: "",
      password: "",
      agree: false,
      showPassword: false,
      snackbar: false,
      snackbarText: "",
      termsDialog: false,
      rules: {
        required: v => !!v || "This field is required",
        email: v => /.+@.+\..+/.test(v) || "E-mail must be valid",
        min: v => (v && v.length >= 6) || "Min 6 characters",
      },
    };
  },
  computed: {
    allFilled() {
      return this.name && this.email && this.password && this.agree;
    }
  },
  methods: {
    openTerms() {
      this.termsDialog = true; // open TermsDialog
    },
    goSignIn() {
      // Navigate to Sign In page (adjust route as needed)
      this.$router.push({ name: "SignIn" });
    },
    async submit() {
      const form = this.$refs.form;
      if (!form) return;

      form.validate();

      if (!this.valid || !this.agree) {
        this.snackbarText = "Please fill in all fields and accept Terms & Privacy.";
        this.snackbar = true;
        return;
      }

      try {
        await axios.post("/api/signup", {
          name: this.name,
          email: this.email,
          password: this.password,
        });

        this.snackbarText = "You have successfully signed up!";
        this.snackbar = true;

        // Reset form
        this.name = "";
        this.email = "";
        this.password = "";
        this.showPassword = false;
        this.agree = false;
        form.resetValidation();

      } catch (err) {
        this.snackbarText =
          err.response?.data?.message || "Sign up failed. Please try again.";
        this.snackbar = true;
      }
    },
  },
};
</script>

<style scoped>
.signup-bg {
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
.muted {
  color: #8b9a99;
}
@media (max-width: 600px) {
  .card-header .title {
    font-size: 1rem;
  }
}
</style>
