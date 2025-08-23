<template>
  <div id="app">
    <SideTop/>
    <main>
      <router-view />              <!-- renders matched route component -->
    </main>
  </div>
</template>


<script>
import SideTop from '../src/components/SideView/SideTop.vue';

export default {
  name: 'App',
  components: { SideTop }
}
</script>

<style>
/* small styles */
nav { margin-bottom: 1rem; }
nav a { margin-right: 0.5rem; color: #42b983; }
</style>
