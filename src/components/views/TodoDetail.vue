<template>
  <v-container>
    <h2>Todo #{{ id }}</h2>
    <p>Details for todo with id {{ id }}.</p>

    <v-btn color="primary" @click="goBack">
      Back
    </v-btn>
  </v-container>
</template>

<script>
export default {
  name: 'TodoDetail',
  props: ['id'],
  methods: {
    goBack() {
      this.$router.push({ name: 'Todos' })
    }
  }
}
</script>
