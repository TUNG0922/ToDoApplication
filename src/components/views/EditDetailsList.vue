<template>
  <v-dialog v-model="visible" max-width="720px" persistent>
    <v-card>
      <v-card-title class="headline">
        <v-icon left>mdi-pencil</v-icon>
        {{ computedTitle }}
      </v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="formValid" lazy-validation>
          <v-text-field
            v-model="form.title"
            label="Task Title"
            outlined
            dense
            :rules="[rules.required]"
            required
          />

          <v-textarea
            v-model="form.description"
            label="Task Description"
            outlined
            dense
            :rules="[rules.required]"
            required
          />

          <v-row>
            <v-col cols="12" sm="4">
              <v-select
                v-model="form.priority"
                :items="priorityOptions"
                label="Priority"
                outlined
                dense
                :rules="[rules.required]"
                required
              />
            </v-col>

            <v-col cols="12" sm="4">
              <v-text-field
                v-model="form.deadline"
                label="Deadline"
                type="date"
                outlined
                dense
                :rules="[rules.required]"
                required
              />
            </v-col>

            <v-col cols="12" sm="4">
              <v-text-field
                v-model="form.assignee"
                label="Assignee"
                outlined
                dense
                :rules="[rules.required]"
                required
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text @click="handleCancel" :disabled="loading">Cancel</v-btn>
        <v-btn color="green" :loading="loading" :disabled="!formValid" @click="handleSave">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'EditDetailsList',
  props: {
    // v-model for dialog visibility
    value: { type: Boolean, default: false },
    // task to edit
    task: { type: Object, default: () => null },
    // optional: explicit dialog title
    title: { type: String, default: '' },
    // show loading state on save button
    loading: { type: Boolean, default: false },
  },
  data() {
    return {
      formValid: false,
      priorityOptions: ['Low', 'Medium', 'High'],
      form: {
        id: null,
        title: '',
        description: '',
        priority: '',
        deadline: '',
        assignee: '',
        createdBy: '',
        createdAt: '',
      },
      rules: {
        required: v => !!v || 'This field is required',
      },
    };
  },
  computed: {
    visible: {
      get() { return this.value; },
      set(v) { this.$emit('input', v); },
    },
    computedTitle() {
      if (this.title) return this.title;
      return this.form && this.form.id ? 'Edit Task' : 'Create Task';
    },
  },
  watch: {
    value(newVal) {
      if (newVal) this.hydrateFormFromTask();
    },
    task: {
      handler() { this.hydrateFormFromTask(); },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    hydrateFormFromTask() {
      const t = this.task || {};
      this.form = {
        id: t.id || null,
        title: t.title || '',
        description: t.description || '',
        priority: t.priority || '',
        deadline: t.deadline || '',
        assignee: t.assignee || '',
        createdBy: t.createdBy || '',
        createdAt: t.createdAt || '',
      };
      // reset validation when dialog opens
      this.$nextTick(() => {
        if (this.$refs.form && this.$refs.form.resetValidation) {
          this.$refs.form.resetValidation();
        }
      });
    },
    handleCancel() {
      this.$emit('cancel');
      this.$emit('input', false);
    },
    handleSave() {
      const ok = this.$refs.form && this.$refs.form.validate ? this.$refs.form.validate() : false;
      if (!ok) return;
      const payload = { ...this.form };
      this.$emit('save', payload);
    },
  },
};
</script>

<style scoped>
.v-card-title .v-icon { margin-right: 8px; }
</style>
