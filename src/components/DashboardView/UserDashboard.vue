<template>
  <v-app class="dashboard-bg">
    <SideTop />

    <v-container fluid class="pt-4">
      <v-row dense>
        <!-- Project selection list -->
        <v-col cols="12" md="4">
          <v-card outlined>
            <v-card-title>Select Project</v-card-title>
            <v-divider></v-divider>
            <v-list dense nav>
              <v-list-item
                v-for="(project, index) in projects"
                :key="project.id || index"
                @click="selectProject(project)"
                :class="{ 'active-project': currentProject === project.name }"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ project.name }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>

          <!-- Add Project button -->
          <v-btn
            color="primary"
            class="mt-2"
            @click="dialog = true"
            block
          >
            Add Project
          </v-btn>
        </v-col>

        <!-- Task list for selected project -->
        <v-col cols="12" md="8">
          <List :project-name="currentProject" />
        </v-col>
      </v-row>

      <!-- Add Project dialog -->
      <AddProject
        :dialog.sync="dialog"
        @project-added="handleProjectAdded"
      />
    </v-container>
  </v-app>
</template>

<script>
import axios from "axios";
import SideTop from "../SideView/SideTop.vue";
import AddProject from "../views/AddProject.vue";
import List from "./ListView/List.vue";

export default {
  name: "UserDashboard",
  components: { SideTop, List, AddProject },
  data() {
    return {
      currentProject: null,
      projects: [],
      dialog: false
    };
  },
  mounted() {
    this.fetchProjects();
  },
  methods: {
    // Fetch all projects
    async fetchProjects() {
      try {
        const res = await axios.get("/api/projects");
        this.projects = Array.isArray(res.data) ? res.data : [];
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      }
    },
    // Set current project to fetch tasks for
    selectProject(project) {
      this.currentProject = project.name;
    },
    // Handle newly added project
    handleProjectAdded(newProject) {
      if (newProject) {
        this.projects.push(newProject);
        this.currentProject = newProject.name;
      }
    }
  }
};
</script>

<style scoped>
.dashboard-bg {
  background: url('@/assets/blueApp.jpg') no-repeat center center fixed;
  background-size: cover;
  min-height: 100vh;
}

.active-project {
  background-color: rgba(25, 118, 210, 0.1);
}
</style>
