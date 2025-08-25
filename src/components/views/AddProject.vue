<template>
  <v-dialog v-model="localDialog" max-width="400">
    <v-card>
      <v-card-title class="headline">Add New Project</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="projectName"
          label="Project Name"
          outlined
          dense
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeDialog">Cancel</v-btn>
        <v-btn color="primary" @click="submitProject">Add</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";

export default {
  name: "AddProject",
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      projectName: "",
    };
  },
  computed: {
    // proxy for the dialog prop — getter returns prop, setter emits update for .sync
    localDialog: {
      get() {
        return this.dialog;
      },
      set(val) {
        this.$emit("update:dialog", val);
      },
    },
  },
  methods: {
    closeDialog() {
      // close via proxy so parent gets update
      this.localDialog = false;
    },
    async submitProject() {
      if (!this.projectName.trim()) {
        // small client-side validation
        this.$refs && this.$refs.projectInput && this.$refs.projectInput.focus && this.$refs.projectInput.focus();
        return alert("Project name cannot be empty!");
      }
      try {
        const res = await axios.post("/api/projects", { name: this.projectName.trim() });
        this.$emit("project-added", res.data); // notify parent
        this.localDialog = false;
        this.projectName = "";
      } catch (err) {
        console.error("Error adding project:", err);
        // show a friendly error
        const msg = err?.response?.data || err.message || "Failed to add project.";
        alert(msg);
      }
    },
  },
};
</script>
