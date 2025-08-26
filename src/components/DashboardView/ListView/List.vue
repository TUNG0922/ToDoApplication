<template>
  <v-container fluid class="mt-4">
    <v-row>
      <!-- LEFT COLUMN: Main Task List -->
      <v-col cols="12" md="9">
        <v-card outlined class="list-card">
          <v-card-title class="card-top">
            Your Tasks - {{ displayProjectName }}
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="openCreateDialog" :disabled="!projectName">Add Task</v-btn>
            <v-btn text color="blue" class="ml-2" @click="goBack">Back</v-btn>
          </v-card-title>

          <v-card-text class="list-table-container">
            <v-data-table
              :headers="headers"
              :items="activeTasks"
              dense
              :items-per-page="5"
              class="elevation-1 full-height-table"
            >
              <template v-slot:[`item.priority`]="{ item }">
                <v-chip small :color="priorityColor(item.priority)" dark>
                  {{ item.priority }}
                </v-chip>
              </template>

              <template v-slot:[`item.deadline`]="{ item }">
                {{ formatDate(item.deadline, true) }}
              </template>

              <template v-slot:[`item.createdAt`]="{ item }">
                {{ formatDate(item.createdAt) }}
              </template>

              <template v-slot:[`item.status`]="{ item, index }">
                <v-select
                  :items="['-', 'Pending', 'Completed']"
                  v-model="item.status"
                  dense
                  hide-details
                  outlined
                  style="max-width: 120px;"
                  @change="updateStatus(item, index)"
                  :placeholder="'-'"
                />
              </template>

              <template v-slot:[`item.actions`]="{ item, index }">
                <v-btn icon @click="viewDescription(item)" :title="'View ' + item.title">
                  <v-icon color="blue">mdi-eye</v-icon>
                </v-btn>

                <v-btn icon @click="openEditDialog(item, index)" :title="'Edit ' + item.title">
                  <v-icon color="orange">mdi-pencil</v-icon>
                </v-btn>

                <v-btn icon @click="openDeleteDialog(item, index)" :title="'Delete ' + item.title">
                  <v-icon color="red">mdi-delete</v-icon>
                </v-btn>
              </template>

              <template v-slot:no-data>
                <div class="text-center grey--text py-4">No tasks available for this project.</div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- RIGHT COLUMN: Overdue Tasks -->
      <v-col cols="12" md="3">
        <OverdueList
          :tasks="overdueTasks"
          :headers="pendingHeaders"
          :formatDate="formatDate"
          :priorityColor="priorityColor"
          @task-deleted="onOverdueTaskDeleted"
          @view="viewDescription"
          @edit="openEditDialog"
        />
      </v-col>
    </v-row>

    <!-- Pending Tasks component (middle) -->
    <PendingTasks
      :tasks="pendingTasks"
      :headers="pendingHeaders"
      :formatDate="formatDate"
      :priorityColor="priorityColor"
      @view="viewDescription"
      @edit="openEditDialog"
      @delete="openDeleteDialog"
      @export="openPendingExport"
    />

    <!-- Completed Tasks component (bottom) -->
    <CompletedTasks
      :tasks="completedTasks"
      :headers="completedHeaders"
      :formatDate="formatDate"
      :priorityColor="priorityColor"
      @view="viewDescription"
      @delete="openDeleteDialog"
      @export="openCompletedExport"
    />

    <!-- CREATE DIALOG -->
    <v-dialog v-model="createDialog" persistent max-width="700px">
      <v-card>
        <v-card-title class="headline">Add New Task</v-card-title>
        <v-card-text>
          <v-form ref="createForm" v-model="createFormValid" lazy-validation>
            <v-text-field
              v-model="createForm.title"
              label="Task Title"
              outlined
              dense
              :rules="[rules.required]"
              required
            />
            <v-textarea
              v-model="createForm.description"
              label="Task Description"
              outlined
              dense
              :rules="[rules.required]"
              required
            />
            <v-row>
              <v-col cols="12" sm="4">
                <v-select
                  v-model="createForm.priority"
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
                  v-model="createForm.deadline"
                  label="Deadline"
                  type="date"
                  outlined
                  dense
                  :rules="[rules.required]"
                  required
                />
              </v-col>
              <v-col cols="12" sm="4">
                <v-autocomplete
                  v-model="createForm.assignee"
                  :items="users"
                  item-text="name"
                  item-value="name"
                  label="Assignee"
                  outlined
                  dense
                  :rules="[rules.required]"
                  required
                  clearable
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="red" @click="closeCreateDialog">Cancel</v-btn>
          <v-btn color="green" :loading="createLoading" :disabled="!createFormValid" @click="createTask">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- DESCRIPTION VIEWER -->
    <v-dialog v-model="descriptionDialog" max-width="600px">
      <v-card>
        <v-card-title class="headline">Task Description</v-card-title>
        <v-card-text>
          <div v-if="currentDescription">{{ currentDescription }}</div>
          <div v-else class="grey--text">No description provided.</div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="descriptionDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- DELETE CONFIRMATION -->
    <DeleteValidation
      v-model="showDeleteDialog"
      :loading="deleteLoading"
      title="Delete task?"
      message="Are you sure you want to permanently delete this task?"
      @confirm="onDeleteConfirmed"
      @cancel="onDeleteCancelled"
    />

    <!-- EDIT COMPONENT -->
    <EditDetailsList
      v-model="showEditDialog"
      :task="editTask"
      :loading="editLoading"
      :users="users"
      title="Edit Task"
      @save="onEditSave"
      @cancel="onEditCancel"
    />
  </v-container>
</template>

<script>
import axios from 'axios';
import CompletedTasks from '../../views/CompletedTasks.vue';
import DeleteValidation from '../../views/DeleteValidation.vue';
import EditDetailsList from '../../views/EditDetailsList.vue';
import PendingTasks from '../../views/PendingTasks.vue';
import OverdueList from './OverdueList.vue';

export default {
  name: 'List',
  components: {
    PendingTasks,
    CompletedTasks,
    OverdueList,
    DeleteValidation,
    EditDetailsList
  },
  props: {
    projectName: { type: String, default: null }
  },
  data() {
    return {
      headers: [
        { text: 'Name', value: 'title' },
        { text: 'Priority', value: 'priority' },
        { text: 'Deadline', value: 'deadline' },
        { text: 'Assignee', value: 'assignee' },
        { text: 'Created By', value: 'createdBy' },
        { text: 'Created At', value: 'createdAt' },
        { text: 'Status', value: 'status' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      pendingHeaders: [
        { text: 'Name', value: 'title' },
        { text: 'Priority', value: 'priority' },
        { text: 'Deadline', value: 'deadline' },
        { text: 'Assignee', value: 'assignee' },
        { text: 'Created At', value: 'createdAt' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      completedHeaders: [
        { text: 'Name', value: 'title' },
        { text: 'Priority', value: 'priority' },
        { text: 'Deadline', value: 'deadline' },
        { text: 'Assignee', value: 'assignee' },
        { text: 'Completed At', value: 'createdAt' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],

      // store all fetched tasks (normalized)
      allTasks: [],

      // tasks shown in main area (user-filtered if currentUser present)
      tasks: [],

      createDialog: false,
      createFormValid: false,
      createLoading: false,
      createForm: { title: '', description: '', priority: '', deadline: '', assignee: '', status: '-'},
      showEditDialog: false,
      editTask: null,
      editIndex: null,
      editLoading: false,
      showDeleteDialog: false,
      pendingDeleteTask: null,
      pendingDeleteIndex: null,
      deleteLoading: false,
      descriptionDialog: false,
      currentDescription: '',
      priorityOptions: ['Low', 'Medium', 'High'],
      users: [],
      rules: { required: v => !!v || 'This field is required' },
    };
  },
  mounted() {
    this.fetchUsers();
    this.fetchTasks(this.projectName);
  },
  computed: {
    displayProjectName() { return this.projectName || 'All Projects'; },

    // main list: non-overdue tasks (from this.tasks - which is user filtered when applicable)
    activeTasks() {
      const today = new Date(); today.setHours(0,0,0,0);
      return this.tasks.filter(t => !t.deadline || new Date(t.deadline) >= today);
    },
    overdueTasks() {
      const today = new Date(); today.setHours(0,0,0,0);
      return this.tasks.filter(t => t.deadline && new Date(t.deadline) < today);
    },
    // pending tasks (from this.tasks so they honor user filtering if present)
    pendingTasks() {
      return this.tasks.filter(t => t.status && t.status.toLowerCase() === 'pending');
    },
    // completed tasks: IMPORTANT — use allTasks (not this.tasks) and filter by projectName + status=Completed
    completedTasks() {
      return this.allTasks.filter(t => {
        const matchesProject = this.projectName ? (t.projectName === this.projectName) : true;
        return matchesProject && t.status && t.status.toLowerCase() === 'completed';
      });
    },
  },
  watch: {
    projectName: { immediate: true, handler(newProject) { this.fetchTasks(newProject); } }
  },
  methods: {
    async updateStatus(task, index) {
      if (!task?.id) return;

      // keep '-' as '-' (no auto-conversion)
      if (task.status === '-') {
        this.$set(this.tasks, index, { ...task });
        return;
      }

      const statusValue = task.status === 'Completed' ? 'completed' : 'pending';

      try {
        const payload = { ...task, status: statusValue };
        const res = await axios.put(`/api/tasks/${task.id}`, payload);

        const updatedTask = {
          ...res.data,
          status: res.data.status === '-' || !res.data.status
                  ? '-'
                  : res.data.status.toLowerCase() === 'completed'
                    ? 'Completed'
                    : res.data.status.toLowerCase() === 'pending'
                      ? 'Pending'
                      : res.data.status
        };

        // update both allTasks and tasks (if item exists there)
        const allIndex = this.allTasks.findIndex(x => x.id === updatedTask.id);
        if (allIndex !== -1) this.$set(this.allTasks, allIndex, updatedTask);

        const idx = this.tasks.findIndex(x => x.id === updatedTask.id);
        if (idx !== -1) this.$set(this.tasks, idx, updatedTask);

      } catch (err) {
        console.error('Failed to update status:', err);
        alert('Failed to update status.');
      }
    },

    /** CREATE */
    openCreateDialog() { this.resetCreateForm(); this.createDialog = true; },
    closeCreateDialog() { this.createDialog = false; },
    resetCreateForm() {
      this.createForm = { title: '', description: '', priority: '', deadline: '', assignee: '', status: '-' };
      this.$nextTick(() => { this.$refs.createForm?.resetValidation?.(); });
    },
    async createTask() {
      if (!this.$refs.createForm.validate()) return;

      if (!this.projectName) {
        alert('Project name is required to create a task.');
        return;
      }

      let createdBy = 'Unknown';
      const raw = localStorage.getItem('authUser');
      if (raw) {
        try { const user = JSON.parse(raw); createdBy = user.name || user.email || 'Unknown'; } catch(e){ console.warn(e); }
      }

      const payload = { ...this.createForm, status: '-', createdBy, createdAt: new Date().toISOString(), projectName: this.projectName };

      this.createLoading = true;
      try {
        const res = await axios.post('/api/tasks', payload);
        // push to both lists appropriately
        const created = res.data || payload;
        this.allTasks.push(created);
        // if current user should see it, push to tasks as well
        const rawUser = localStorage.getItem('authUser');
        let currentUser = null;
        if (rawUser) {
          try { currentUser = JSON.parse(rawUser).name; } catch(e){/*noop*/ }
        }
        if (!currentUser || created.createdBy === currentUser || created.assignee === currentUser) {
          this.tasks.push(created);
        }

        this.closeCreateDialog();
        this.resetCreateForm();
      } catch (err) {
        console.error(err);
        alert('Failed to save task.');
      } finally {
        this.createLoading = false;
      }
    },

    async fetchTasks(projectName) {
      try {
        const params = {};
        if (projectName) params.project = projectName;

        // do NOT send user param here - we'll keep a full copy of tasks in allTasks
        // but still detect currentUser to create the user-filtered tasks list
        const raw = localStorage.getItem('authUser');
        let currentUser = null;
        if (raw) {
          try { currentUser = JSON.parse(raw).name; } catch (e) { console.warn('Failed to parse authUser', e); }
        }

        const res = await axios.get('/api/tasks', { params });
        let tasks = Array.isArray(res.data) ? res.data : [];

        // Normalize status: Completed / Pending / keep-as-is / '-'
        tasks = tasks.map(t => ({
          ...t,
          status: t.status
                  ? (t.status.toLowerCase() === 'completed' ? 'Completed'
                    : t.status.toLowerCase() === 'pending' ? 'Pending'
                    : t.status)
                  : '-'
        }));

        // store full normalized list
        this.allTasks = tasks;

        // set tasks shown in main area: if currentUser is present, filter by createdBy or assignee
        if (currentUser) {
          this.tasks = tasks.filter(t => t.createdBy === currentUser || t.assignee === currentUser);
        } else {
          this.tasks = tasks;
        }

      } catch (err) {
        console.error(err);
        this.allTasks = [];
        this.tasks = [];
      }
    },

    openEditDialog(task, index) {
      this.editTask = { ...task };
      this.editIndex = index;
      this.showEditDialog = true;
    },

    async onEditSave(payload) {
      if (!payload?.id) return;
      this.editLoading = true;
      try {
        const res = await axios.put(`/api/tasks/${payload.id}`, payload);
        const updated = res.data || payload;

        // update both allTasks and tasks lists
        const allIndex = this.allTasks.findIndex(x => x.id === updated.id);
        if (allIndex !== -1) this.$set(this.allTasks, allIndex, updated);

        const idx = this.tasks.findIndex(x => x.id === updated.id);
        if (idx !== -1) this.$set(this.tasks, idx, updated);

        this.showEditDialog = false;
      } catch (err) {
        console.error(err);
        alert('Update failed.');
      } finally {
        this.editLoading = false;
        this.editTask = null;
        this.editIndex = null;
      }
    },

    openDeleteDialog(task, index) {
      this.pendingDeleteTask = task;
      this.pendingDeleteIndex = index;
      this.showDeleteDialog = true;
    },

    async onDeleteConfirmed() {
      if (!this.pendingDeleteTask) { this.showDeleteDialog = false; return; }
      const id = this.pendingDeleteTask.id;
      if (!id) { this.tasks.splice(this.pendingDeleteIndex, 1); this.clearPendingDelete(); return; }
      this.deleteLoading = true;
      try {
        const res = await axios.delete(`/api/tasks/${id}`);
        if (res.status >= 200 && res.status < 300) {
          // remove from both lists
          this.tasks = this.tasks.filter(t => t.id !== id);
          this.allTasks = this.allTasks.filter(t => t.id !== id);
        } else {
          alert('Delete failed.');
        }
      } catch (err) {
        console.error(err);
        alert('Delete failed.');
      } finally {
        this.deleteLoading = false;
        this.clearPendingDelete();
      }
    },

    onDeleteCancelled() { this.clearPendingDelete(); },

    clearPendingDelete() {
      this.pendingDeleteTask = null;
      this.pendingDeleteIndex = null;
      this.showDeleteDialog = false;
      this.deleteLoading = false;
    },

    viewDescription(task) {
      this.currentDescription = task?.description || '';
      this.descriptionDialog = true;
    },

    formatDate(isoString, dateOnly = false) {
      if (!isoString) return '-';
      const d = new Date(isoString);
      return isNaN(d) ? isoString : (dateOnly ? d.toLocaleDateString() : d.toLocaleString());
    },

    priorityColor(priority) {
      switch (priority) {
        case 'High': return 'red';
        case 'Medium': return 'orange';
        case 'Low': return 'green';
        default: return 'grey';
      }
    },

    onOverdueTaskDeleted(id) {
      this.tasks = this.tasks.filter(t => t.id !== id);
      this.allTasks = this.allTasks.filter(t => t.id !== id);
    },

    goBack() { this.$emit('back'); },

    async fetchUsers() {
      try {
        const res = await axios.get('/api/users');
        this.users = Array.isArray(res.data) ? res.data : [];
      } catch (err) {
        console.error('Failed to fetch users:', err);
        this.users = [];
      }
    },

    openPendingExport() { alert('Export pending tasks (not implemented).'); },
    openCompletedExport() { alert('Export completed tasks (not implemented).'); }
  }
};
</script>

<style scoped>
.list-card{ max-width:100%; min-height:500px; margin:0 auto; display:flex; flex-direction:column; }
.card-top{ flex:0 0 auto; display:flex; justify-content:space-between; align-items:center; }
.list-table-container{ flex:1 1 auto; display:flex; flex-direction:column; justify-content:flex-end; overflow-y:auto; }
.full-height-table{ flex:1 1 auto; }
.overdue-card{ height:100%; max-height:700px; overflow-y:auto; }
.completed-card{ margin-top:16px; }
.pending-card{ margin-top:16px; }
</style>
