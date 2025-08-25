<template>
  <v-app>
    <SideTop />
    <!-- CalendarView immediately below SideTop -->
    <CalendarView class="calendar-full" />
  </v-app>
</template>

<script>
import SideTop from '../SideView/SideTop.vue';
import CalendarView from './CalendarView.vue';

export default {
  name: 'Calendar',
  components: { SideTop, CalendarView },
};
</script>

<style scoped>
/* Make calendar take full width and remove top padding */
.calendar-full {
  margin-top: 0 !important;
  padding-top: 0 !important;
}
</style>
