import moment from 'moment'

class API extends WebSocket {
    constructor(baseURL, wsUrl) {
        super(wsUrl)
        this.baseURL = baseURL
        this.wsUrl = wsUrl
        this.callbacks = {
            add: () => {},
            remove: () => {},
            update: () => {}
        }

        this.addEventListener('message', (event) => {
            const command = JSON.parse(event.data)
            if (command.message === 'add_todo') {
                const todo = {
                    ...command.todo,
                    id: Number.parseInt(command.todo.id),
                    date: moment(command.todo.date, 'DD-MM-YYYY')
                }
                this.callbacks.add(todo)
            } else if (command.message === 'update_todo') {
                const todo = {
                    ...command.todo,
                    id: Number.parseInt(command.todo.id),
                    date: moment(command.todo.date, 'DD-MM-YYYY')
                }
                this.callbacks.update(todo)
            } else if (command.message === 'delete_todo') {
                let todo_id = Number.parseInt(command.todo_id)
                this.callbacks.remove(todo_id)
            }
        })
    }

    on(event, callback) {
        this.callbacks[event] = callback
    }

    getAllTodos () {
        let todos = fetch(this.baseURL, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(todos => {
            for (let todo of todos) {
                todo.date = moment(todo.date, 'DD-MM-YYYY')
            }
            return todos
        })

        return todos
    }

    addTodo (todo) {
        todo = {...todo, date: todo.date.format('DD-MM-YYYY')}
        return fetch(this.baseURL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(todo)
        })
        .then(response => response.json())
        .then(todo => ({...todo, date: moment(todo.date, 'DD-MM-YYYY')}))
    }

    removeTodo(todoId) {
        return fetch(`${this.baseURL}/${todoId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            }
        })
    }

    updateTodo(todo) {
        todo = {...todo, date: todo.date.format('DD-MM-YYYY')}
        return fetch(`${this.baseURL}/${todo.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(todo)
        })  
    }
}

export default API