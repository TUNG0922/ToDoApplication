<template>
  <v-app-bar app color="primary" dark>
    <!-- Logo / Title -->
    <v-toolbar-title class="mr-6">
      ToDo App
    </v-toolbar-title>

    <!-- Navigation links -->
    <v-btn text to="/" exact>
      Home
    </v-btn>
    <v-btn text to="/about" exact>
      About
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {
  name: "SideTop"
}
</script>

<style scoped>
/* optional: make active route stand out */
.v-btn--active {
  border-bottom: 2px solid white;
}
</style>
