<template>
  <v-app class="dashboard-bg">
    <SideTop />

    <v-container fluid class="pt-6">
      <v-row dense justify="center">
        <!-- Project selection list: only shows if no project selected -->
        <v-col cols="12" md="6" v-if="!currentProject">
          <v-card outlined class="project-card">
            <v-card-title class="headline">Select Project</v-card-title>
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
            <v-card-actions>
              <v-btn color="primary" block @click="dialog = true">
                Add Project
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <!-- Task list for selected project -->
        <v-col cols="12" md="12" v-if="currentProject">
          <List :project-name="currentProject" @back="currentProject = null" />
        </v-col>
      </v-row>

      <!-- Add Project dialog -->
      <AddProject
        :dialog.sync="dialog"
        :current-user="currentUser"
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
      dialog: false,
      currentUser: "", // logged-in user's name
    };
  },
  mounted() {
    // Get logged-in user from localStorage
    const authUser = JSON.parse(localStorage.getItem("authUser"));
    if (authUser && authUser.name) {
      this.currentUser = authUser.name;
    }

    this.fetchProjects();
  },
  methods: {
    async fetchProjects() {
      try {
        const res = await axios.get("/api/projects/user", {
          params: { username: this.currentUser }
        });
        this.projects = Array.isArray(res.data) ? res.data : [];
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      }
    },
    selectProject(project) {
      this.currentProject = project.name;
    },
    handleProjectAdded(newProject) {
      if (newProject) {
        // Only add if user is creator or assignee
        if (
          newProject.created_by === this.currentUser ||
          newProject.assignee === this.currentUser
        ) {
          this.projects.push(newProject);
          this.currentProject = newProject.name;
        }
      }
    },
  },
};
</script>

<style scoped>
.dashboard-bg {
  background: url('@/assets/blueApp.jpg') no-repeat center center fixed;
  background-size: cover;
  min-height: 100vh;
}

.project-card {
  padding: 16px;
  transition: transform 0.2s;
}

.project-card:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
}

.active-project {
  background-color: rgba(25, 118, 210, 0.1);
  border-left: 4px solid #1976d2;
}

.v-list-item {
  cursor: pointer;
  transition: background 0.2s;
}

.v-list-item:hover {
  background-color: rgba(25, 118, 210, 0.05);
}

.v-card-actions {
  margin-top: 12px;
}

.v-btn {
  text-transform: none;
  font-weight: 500;
}
</style>
