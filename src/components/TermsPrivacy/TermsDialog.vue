<template>
  <v-dialog v-model="internalShow" max-width="500">
    <v-card>
      <v-card-title>Terms & Privacy</v-card-title>
      <v-card-text style="max-height: 300px; overflow-y: auto;">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Nulla condimentum, justo sit amet ultricies cursus, justo nisi porta neque, vel malesuada urna.
        </p>
        <p>
          By using this app, you agree to our privacy policy and terms of service.
        </p>
        <p>
          You should read this carefully before proceeding with the signup.
        </p>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="close">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "TermsDialog",
  props: {
    value: {          // use 'value' prop for v-model
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      internalShow: this.value
    };
  },
  watch: {
    value(val) {
      this.internalShow = val; // sync parent -> internal
    },
    internalShow(val) {
      this.$emit("input", val); // sync internal -> parent
    }
  },
  methods: {
    close() {
      this.internalShow = false;
    }
  }
};
</script>
