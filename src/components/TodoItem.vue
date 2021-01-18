<template>
  <span
    class="todo-text"
    :class="{ stroke: todo.done }"
    :style="{ backgroundColor: todoColour() }"
    >{{ todo.text }}</span
  >
  <span
    class="todo-date"
    :class="{ stroke: todo.done }"
    :style="{ backgroundColor: todoColour() }"
    >{{ todo.date.format("MM-DD-YYYY") }}</span
  >
  <button class="todo-remove-button" v-on:click="remove">Remove</button>
  <button class="todo-done-button" v-on:click="done" :disabled="todo.done">
    Done
  </button>
</template>

<script>
import moment from 'moment'

export default {
  name: "TodoItem",
  props: {
      'todo': Object,
      'color': String
  },
  emits: [
      'remove',
      'done'
  ],
  data () {
    return {
    }
  },
  methods: {
    remove () {
      this.$emit('remove')
    },
    done () {
      this.$emit('done')
    },
    todoColour() {
      if (this.todo.date.isSame(moment(), 'day')) {
        return '#faa6'
      }
      else if (this.todo.date.isBefore(moment(), 'day')) {
        return '#aaa6'
      }
      else if (this.todo.date.isAfter(moment(), 'day')) {
        return '#0a06'
      }
    }
  }
}
</script>

<style scoped>
span {
  text-align: center;
  padding: 5px;
  margin-left: 2px;
  margin-right: 2px;
}

.stroke {
  text-decoration: line-through;
}
</style>