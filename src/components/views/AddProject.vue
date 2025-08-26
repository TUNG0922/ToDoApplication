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
          ref="projectInput"
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
    currentUser: {   // logged-in user from parent
      type: String,
      required: true,
    },
  },
  data() {
    return {
      projectName: "",
    };
  },
  computed: {
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
      this.localDialog = false;
    },
    async submitProject() {
      if (!this.projectName.trim()) return alert("Project name cannot be empty!");

      try {
        const res = await axios.post("/api/projects", {
          name: this.projectName.trim(),
          created_by: this.currentUser,  // send current user as creator
        });
        this.$emit("project-added", res.data); // triggers handleProjectAdded in parent
        this.localDialog = false;
        this.projectName = "";
      } catch (err) {
        const msg = err?.response?.data || err.message || "Failed to add project.";
        alert(msg);
      }
    },
  },
};
</script>
