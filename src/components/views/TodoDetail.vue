<template>
  <div>
    <h2>Todo #{{ id }}</h2>
    <p>Details for todo with id {{ id }}.</p>
    <button @click="goBack">Back</button>
  </div>
</template>

<script>
export default {
  name: 'TodoDetail',
  props: ['id'],
  methods: {
    goBack() { this.$router.push({ name: 'Todos' }) }
  }
}
</script>
