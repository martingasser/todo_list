<template>
    <span class="todo-text" :style="{ backgroundColor: todoColour()}">{{ todo.text }}</span>
    <span class="todo-date" :style="{ backgroundColor: todoColour()}">{{ todo.date.format('MM-DD-YYYY') }}</span>
    <button class="todo-remove-button" v-on:click="remove">Remove</button>
</template>

<script>
import moment from 'moment'

export default {
  name: "Todo",
  props: {
      'todo': Object,
      'color': String
  },
  emits: [
      'remove'
  ],
  data () {
    return {
    }
  },
  methods: {
    remove () {
        this.$emit('remove')
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
</style>