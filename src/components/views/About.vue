<template>
  <v-app>
    <!-- Reuse your top navigation -->
    <SideTop />

    <v-main>
      <v-container>
        <h2>About</h2>
        <p>About this app.</p>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
// Import SideTop — adjust path if needed
// If About.vue is in src/views, this path should work:
import SideTop from '@/components/SideView/SideTop.vue';

export default {
  name: 'About',
  components: { SideTop }
}
</script>
