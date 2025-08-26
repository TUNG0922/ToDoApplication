<template>
  <v-row class="mt-4">
    <v-col cols="12">
      <v-card outlined class="pending-card">
        <v-card-title class="card-top">
          Pending Tasks
          <v-spacer />
        </v-card-title>

        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="tasks"
            dense
            :items-per-page="5"
            class="elevation-1"
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

            <template v-slot:[`item.actions`]="{ item, index }">
              <v-btn icon @click="$emit('view', item, index)" :title="'View ' + item.title">
                <v-icon color="blue">mdi-eye</v-icon>
              </v-btn>

              <v-btn icon @click="$emit('edit', item, index)" :title="'Edit ' + item.title">
                <v-icon color="orange">mdi-pencil</v-icon>
              </v-btn>

              <v-btn icon @click="$emit('delete', item, index)" :title="'Delete ' + item.title">
                <v-icon color="red">mdi-delete</v-icon>
              </v-btn>
            </template>

            <template v-slot:no-data>
              <div class="text-center grey--text py-4">No pending tasks yet.</div>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'PendingTasks',
  props: {
    tasks: { type: Array, default: () => [] },
    headers: { type: Array, default: () => [] },
    formatDate: { type: Function, required: true },
    priorityColor: { type: Function, required: true }
  }
};
</script>

<style scoped>
.pending-card{ margin-top:16px; }
.card-top{ display:flex; align-items:center; }
</style>
