<template>
  <div>
    <h2>Todos</h2>
    <ul>
      <li v-for="t in todos" :key="t.id">
        <router-link :to="{ name: 'TodoDetail', params: { id: t.id } }">
          {{ t.title }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Todos',
  data() {
    return {
      todos: [
        { id: 1, title: 'Buy milk' },
        { id: 2, title: 'Walk dog' },
      ]
    }
  }
}
</script>
