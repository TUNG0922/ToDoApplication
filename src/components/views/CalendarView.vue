<template>
  <v-app>
    <v-container fluid class="pb-6 pt-0">
      <!-- Header: Month + Year -->
      <v-row class="align-center mb-3">
        <v-col cols="12" md="6" class="d-flex align-center justify-center justify-md-start">
          <div class="calendar-title">{{ title }}</div>
        </v-col>
        <v-col cols="12" md="6" class="text-md-right">
          <v-btn icon @click="prev" title="Previous">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn text @click="goToday">Today</v-btn>
          <v-btn icon @click="next" title="Next">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <v-row>
        <!-- Calendar -->
        <v-col cols="12" md="9">
          <v-sheet elevation="2" class="calendar-sheet">
            <v-calendar
              ref="calendar"
              v-model="focus"
              :events="events"
              :event-color="getEventColor"
              color="primary"
              type="month"
              @click:event="onEventClick"
              :weekdays="[0,1,2,3,4,5,6]"
            >
              <template v-slot:event="{ event }">
                <div class="calendar-event" :title="event.name">
                  <div class="event-header">
                    <span class="event-dot" :style="{ backgroundColor: getEventColor(event) }"></span>
                    <span class="event-name">{{ event.name }}</span>
                  </div>
                  <div class="event-meta">
                    <span class="event-assignee" v-if="event.assignee">👤 {{ event.assignee }}</span>
                    <span class="event-priority" v-if="event.priority">{{ event.priority }}</span>
                  </div>
                </div>
              </template>
            </v-calendar>
          </v-sheet>
        </v-col>

        <!-- Legend -->
        <v-col cols="12" md="3">
          <v-card outlined class="side-card">
            <v-card-title class="subtitle-1 font-weight-medium">Legend</v-card-title>
            <v-card-text>
              <div class="legend-row">
                <span class="legend-dot" style="background: #e53935;"></span>
                <span>High</span>
              </div>
              <div class="legend-row">
                <span class="legend-dot" style="background: #fb8c00;"></span>
                <span>Medium</span>
              </div>
              <div class="legend-row">
                <span class="legend-dot" style="background: #43a047;"></span>
                <span>Low</span>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Event details dialog -->
      <v-dialog v-model="dialog" max-width="600px">
        <v-card>
          <v-card-title>
            <div>
              <div class="headline">{{ selectedEvent?.name }}</div>
              <div class="caption grey--text">{{ formatDate(selectedEvent?.start) }}</div>
            </div>
            <v-spacer></v-spacer>
            <v-btn icon @click="dialog = false"><v-icon>mdi-close</v-icon></v-btn>
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col cols="12">
                <div v-if="selectedEvent?.description">{{ selectedEvent.description }}</div>
                <div v-else class="grey--text">No description provided.</div>
              </v-col>
              <v-col cols="12" sm="6">
                <strong>Assignee</strong>
                <div>{{ selectedEvent?.assignee || '-' }}</div>
              </v-col>
              <v-col cols="12" sm="6">
                <strong>Priority</strong>
                <div>{{ selectedEvent?.priority || '-' }}</div>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" @click="dialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-app>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CalendarView',
  data() {
    return {
      focus: new Date().toISOString().slice(0, 10),
      tasks: [],
      events: [],
      dialog: false,
      selectedEvent: null,
    };
  },
  computed: {
    title() {
      if (!this.focus) return '';
      const d = new Date(this.focus);
      return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    },
  },
  mounted() {
    this.fetchTasks();
  },
  methods: {
    async fetchTasks() {
      try {
        const res = await axios.get('/api/tasks');
        this.tasks = Array.isArray(res.data) ? res.data : [];
        this.mapTasksToEvents();
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
        this.tasks = [];
        this.events = [];
      }
    },
    mapTasksToEvents() {
      this.events = (this.tasks || [])
        .filter(t => t && t.deadline)
        .map(t => {
          const start = this.parseDateOnly(t.deadline);
          const startIso = start instanceof Date && !isNaN(start)
            ? start.toISOString().substr(0, 10)
            : String(t.deadline);
          return {
            id: t.id,
            name: t.title || 'Untitled',
            start: startIso,
            end: startIso,
            description: t.description,
            assignee: t.assignee,
            priority: t.priority,
            raw: t,
          };
        });
    },
    parseDateOnly(value) {
      if (!value) return null;
      if (value instanceof Date) return value;
      const s = String(value);
      const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(s);
      return new Date(isDateOnly ? `${s}T00:00:00` : s);
    },
    getEventColor(event) {
      const p = (event.priority || '').toLowerCase();
      if (p === 'high') return '#e53935';
      if (p === 'medium') return '#fb8c00';
      if (p === 'low') return '#43a047';
      return '#1976d2';
    },
    onEventClick({ event }) {
      this.selectedEvent = event;
      this.dialog = true;
    },
    formatDate(iso) {
      if (!iso) return '-';
      const d = this.parseDateOnly(iso);
      return d instanceof Date && !isNaN(d) ? d.toLocaleDateString() : String(iso);
    },
    prev() {
      const cal = this.$refs.calendar;
      if (cal && cal.prev) cal.prev();
      if (cal && cal.focus) this.focus = cal.focus;
    },
    next() {
      const cal = this.$refs.calendar;
      if (cal && cal.next) cal.next();
      if (cal && cal.focus) this.focus = cal.focus;
    },
    goToday() {
      this.focus = new Date().toISOString().substr(0, 10);
    },
  },
};
</script>

<style scoped>
.calendar-title {
  font-size: 28px;
  font-weight: 700;
}

.calendar-sheet {
  height: 780px;
  border-radius: 10px;
  overflow: visible; /* allow content to expand */
}

.calendar-event {
  background: rgba(255, 255, 255, 0.97);
  border-left: 5px solid #1976d2;
  border-radius: 8px;
  padding: 8px 10px;
  margin-bottom: 6px;
  font-size: 14px;
  color: #111;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  min-height: 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.1s, box-shadow 0.2s;

  /* allow text to wrap */
  white-space: normal;
  word-break: break-word;
  overflow: visible;
  height: auto !important; /* override fixed height from Vuetify */
  max-height: none !important;
}

.calendar-event:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.25);
}

.event-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  font-size: 14px;
  flex-wrap: wrap; /* wrap long titles */
}

.event-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.event-name {
  flex: 1 1 auto;
  white-space: normal;
  overflow: visible;
  word-break: break-word;
}

.event-meta {
  font-size: 12px;
  color: #555;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 2px;
}

.event-assignee {
  font-style: italic;
}

.event-priority {
  font-weight: bold;
}

.side-card {
  position: sticky;
  top: 20px;
}

.legend-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
</style>
