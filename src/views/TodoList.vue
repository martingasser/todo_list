<template>
  <div class="wrapper">
    <h1>What should <span :style="{color: userColour}">{{ currentUser }}</span> do?</h1>
    <button id="logout" @click="logout">Logout</button>
    <div class="newtodo">
      <input
        type="text"
        name="todo-text"
        v-model.trim="newTodoText"
        class="todo-text"
        placeholder="New todo"
        @keyup.enter="addTodo()"
      />
      <datepicker v-on:update="dateUpdated" />
      <button class="todo-add-button" v-on:click="addTodo()">Add</button>
    </div>

    <ul v-if="todos.length">
      <li class="todo">
        <span class="todo-text list-header">Todo</span>
        <span class="todo-date list-header">Due date</span>
        <span class="todo-empty-button list-header"></span>
        <span class="todo-empty-button list-header"></span>
      </li>

      <li
        class="todo"
        :style="[ todoStyle, { borderColor: todoColour(todo) } ]"
        v-for="todo in todos"
        :key="todo.id">
        <todo-item
          :todo="todo"
          v-on:remove="removeTodo(todo)"
          v-on:done="doneTodo(todo)"
        />
      </li>
    </ul>
    <p class="none" v-else>Add a new todo in the input above</p>
  </div>
</template>

<script>
import datepicker from "@/components/datepicker.vue";
import TodoItem from "@/components/TodoItem.vue";
import api from "@/api.js";

export default {
  name: "App",
  components: {
    datepicker,
    TodoItem,
  },
  data() {
    return {
      newTodoText: "",
      newTodoDate: "",
      todos: [],
      users: [],
      todoStyle: {
        borderLeftStyle: 'solid',
        borderLeftWidth: '5px'
      }
    };
  },
  mounted() {
    api.on('add', (todo) => {
      this.todos.push(todo)
      this.todos.sort((todoA, todoB) => -todoA.date.diff(todoB.date))
      this.newTodoText = ""
    })

    api.on('update', (todo) => {
        this.todos = this.todos.map((_item) => {
            if (_item.id === todo.id) {
              return todo
            }
            return _item
        })
    })

    api.on('remove', (todo_id) => {
        this.todos = this.todos.filter((_item) => _item.id != todo_id)
    })

    api.on('addUser', user => {
      this.users.push(user)
    })

    this.getAllTodos()
    this.getAllUsers()
  },
  methods: {
    getAllTodos() {
      this.todos = [];
      api.getAllTodos().then((data) => {
        for (let d of data) {
          this.todos.push(d);
        }
        this.todos.sort((todoA, todoB) => -todoA.date.diff(todoB.date));
      });
    },
    getAllUsers () {
      api.getAllUsers().then(users => {
        this.users = users
      })
    },
    addTodo() {
      if (this.newTodoText) {
        api
          .addTodo({
            text: this.newTodoText,
            date: this.newTodoDate,
            user: this.currentUser,
            done: false,
          })
          .then(() => {
          });
      }
    },

    removeTodo(item) {
      api.removeTodo(item.id);
    },

    doneTodo(todo) {
        todo.done = true
      api.updateTodo(todo)
    },

    dateUpdated(date) {
      this.newTodoDate = date.clone();
    },

    logout() {
        api.logout()
        this.$router.push('/login')
    },

    todoColour (todo) {
      const user = this.users.find(u => u.username == todo.user)
      if (user) {
        const rgb = user.colour
        return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
      } else {
        return `rgb(0, 0, 0)`
      }
    }
  },
  computed: {
      currentUser () {
          return api.currentUser().user.username
      },
      userColour () {
        const rgb = api.currentUser().user.colour
        return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
      }
  }
};
</script>

<style>
html,
body {
  font: 16px/1.2 BlinkMacSystemFont, -apple-system, "Segoe UI", Roboto,
    Helvetica, Arial, sans-serif;
  padding: 10px;
}

#logout {
    margin: 5px;
}

.wrapper {
  width: 75%;
  margin: 0 auto;
}

.newtodo {
  display: flex;
  width: 100%;
}

.todo {
  display: flex;
  width: 100%;
  margin-bottom: 5px;
}

.list-header {
  text-align: center;
  padding: 5px;
  margin-left: 2px;
  margin-right: 2px;
  background-color: #eee;
  color: black;
}

.todo-text {
  flex: 4;
  text-align: center;
}

.todo-date {
  flex: 3;
  text-align: center;
}

.todo-add-button {
  flex: 1;
  border: 1px solid green;
  background: green;
  color: white;
  font-size: 0.8rem;
  padding: 2px 4px;
  cursor: pointer;
  margin-left: 2px;
  margin-right: 2px;
  outline: none;
}

.todo-remove-button {
  flex: 1;
  border: 1px solid red;
  background-color: red;
  color: white;
  font-size: 0.8rem;
  padding: 2px 4px;
  cursor: pointer;
  margin-left: 2px;
  margin-right: 2px;
}

.todo-done-button {
  flex: 1;
  border: 1px solid green;
  background-color: green;
  color: white;
  font-size: 0.8rem;
  padding: 2px 4px;
  cursor: pointer;
  margin-left: 2px;
  margin-right: 2px;
}

.todo-done-button:disabled {
  flex: 1;
  border: 1px solid rgb(176, 189, 176);
  background-color: rgb(176, 189, 176);
  color: white;
  font-size: 0.8rem;
  padding: 2px 4px;
  cursor: pointer;
  margin-left: 2px;
  margin-right: 2px;
}

.todo-empty-button {
  flex: 1;
  padding: 2px 4px;
  margin-left: 2px;
  margin-right: 2px;
}

ul,
li {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

ul {
  margin-top: 40px;
}

button {
  border: 1px solid green;
  background: green;
  color: white;
  font-size: 0.8rem;
  padding: 2px 4px;
  cursor: pointer;
}

p.none {
  color: #888;
  font-size: small;
}
</style>
