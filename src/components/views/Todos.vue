<template>
  <v-container fluid>
    <h2>Todos</h2>

    <v-list dense>
      <v-list-item
        v-for="t in todos"
        :key="t.id"
        :to="{ name: 'TodoDetail', params: { id: t.id } }"
        link
      >
        <v-list-item-content>
          <v-list-item-title>{{ t.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script>
export default {
  name: 'Todos',
  data() {
    return {
      todos: [
        { id: 1, title: 'Buy milk' },
        { id: 2, title: 'Walk dog' }
      ]
    }
  }
}
</script>

<style scoped>
h2 {
  margin: 0 0 12px;
}
</style>
