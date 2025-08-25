<template>
  <v-card outlined class="overdue-card">
    <v-card-title class="headline">Overdue Tasks</v-card-title>

    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="filtered"
        :items-per-page="5"
        dense
        class="elevation-1"
        :item-class="rowClass"
      >
        <!-- priority chip -->
        <template v-slot:[`item.priority`]="{ item }">
          <v-chip small :color="priorityColor(item.priority)" dark>
            {{ item.priority }}
          </v-chip>
        </template>

        <!-- formatted deadline, colored red -->
        <template v-slot:[`item.deadline`]="{ item }">
          <span class="deadline-red">
            {{ formatDate(item.deadline, true) }}
          </span>
        </template>

        <!-- assignee -->
        <template v-slot:[`item.assignee`]="{ item }">
          <div>{{ item.assignee || '-' }}</div>
        </template>

        <!-- delete action -->
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn icon @click="openDelete(item)" :title="'Delete ' + item.title">
            <v-icon color="red">mdi-delete</v-icon>
          </v-btn>
        </template>

        <template v-slot:no-data>
          <div class="text-center grey--text py-4">
            No overdue tasks!
          </div>
        </template>
      </v-data-table>
    </v-card-text>

    <!-- Delete confirmation (controlled via v-model) -->
    <DeleteValidation
      v-model="deleteDialog"
      :loading="deleteLoading"
      title="Delete task?"
      message="Are you sure you want to permanently delete this overdue task?"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </v-card>
</template>

<script>
import axios from 'axios';
import DeleteValidation from '../../views/DeleteValidation.vue';

export default {
  name: 'OverdueList',
  components: { DeleteValidation },
  props: {
    tasks: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      headers: [
        { text: 'Name', value: 'title' },
        { text: 'Priority', value: 'priority' },
        { text: 'Deadline', value: 'deadline' },
        { text: 'Assignee', value: 'assignee' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      deleteDialog: false,
      deleteLoading: false,
      selectedTask: null,
    };
  },
  computed: {
    filtered() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return (this.tasks || []).filter((t) => {
        if (!t || !t.deadline) return false;
        const d = this.parseDateOnly(t.deadline);
        return d instanceof Date && !isNaN(d) && d < today;
      });
    },
  },
  methods: {
    parseDateOnly(value) {
      if (!value) return null;
      if (value instanceof Date) return value;
      const s = String(value);
      const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(s);
      return new Date(isDateOnly ? `${s}T00:00:00` : s);
    },

    formatDate(isoLike, dateOnly = false) {
      if (!isoLike) return '-';
      const d = this.parseDateOnly(isoLike);
      if (!(d instanceof Date) || isNaN(d)) return String(isoLike);
      return dateOnly ? d.toLocaleDateString() : d.toLocaleString();
    },

    priorityColor(priority) {
      switch (priority) {
        case 'High': return 'red';
        case 'Medium': return 'orange';
        case 'Low': return 'green';
        default: return 'grey';
      }
    },

    rowClass(item) {
      const d = this.parseDateOnly(item && item.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (d instanceof Date && !isNaN(d) && d < today) {
        return 'overdue-row';
      }
      return '';
    },

    openDelete(task) {
      this.selectedTask = task;
      this.deleteDialog = true;
    },

    cancelDelete() {
      this.selectedTask = null;
      this.deleteDialog = false;
    },

    async confirmDelete() {
      if (!this.selectedTask || !this.selectedTask.id) {
        // fallback: just close if no id
        this.cancelDelete();
        return;
      }

      const id = this.selectedTask.id;
      this.deleteLoading = true;

      try {
        const res = await axios.delete(`/api/tasks/${id}`);
        // accept any 2xx as success
        if (res.status >= 200 && res.status < 300) {
          // notify parent to remove the task from its tasks array
          this.$emit('task-deleted', id);
        } else {
          console.error('Unexpected delete response', res);
          // you can show a user message here
        }
      } catch (err) {
        console.error('Failed to delete task:', err);
        // optionally show alert to user
      } finally {
        this.deleteLoading = false;
        this.deleteDialog = false;
        this.selectedTask = null;
      }
    },
  },
};
</script>

<style scoped>
.overdue-card {
  min-height: 500px;
}
.overdue-row {
  background-color: #ffebee !important;
}
.deadline-red {
  color: #d32f2f;
  font-weight: 600;
}
</style>
