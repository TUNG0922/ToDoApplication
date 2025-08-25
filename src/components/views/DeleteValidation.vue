<template>
  <v-dialog v-model="visible" max-width="480px" persistent>
    <v-card>
      <v-card-title class="headline">
        <v-icon left>mdi-alert-circle</v-icon>
        {{ title }}
      </v-card-title>

      <v-card-text>
        <div v-if="message" class="mb-4">{{ message }}</div>
        <slot>
          <div class="grey--text">This action cannot be undone. Are you sure you want to continue?</div>
        </slot>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text @click="onCancel" :disabled="loading">Cancel</v-btn>
        <v-btn :loading="loading" color="red" dark @click="onConfirm">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'DeleteValidation',
  props: {
    // v-model binding
    value: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: 'Confirm Delete',
    },
    message: {
      type: String,
      default: '',
    },
    // show spinner on confirm while awaiting backend
    loading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    visible: {
      get() {
        return this.value;
      },
      set(v) {
        this.$emit('input', v);
      },
    },
  },
  methods: {
    onCancel() {
      this.$emit('input', false);
      this.$emit('cancel');
    },
    onConfirm() {
      // parent should handle actual deletion; we just emit confirm event
      this.$emit('confirm');
    },
  },
};
</script>

<style scoped>
.v-card-title .v-icon {
  margin-right: 8px;
}
</style>
