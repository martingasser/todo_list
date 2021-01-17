import moment from 'moment'

const host = "localhost";
const port = 8081;
const wsProtocol = "ws";
const httpProtocol = "http";

const wsUrl = `${wsProtocol}://${host}:${port}`;
const apiUrl = `${httpProtocol}://${host}:${port}/todos`;

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

    currentUser () {
        const user = JSON.parse(localStorage.getItem('user'))
        return user
    }

    isAuthenticated () {
        const user = this.currentUser()
        if (! user) {
            return Promise.reject('Not authenticated')
        }
        const requestOptions = {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.accessToken}`
            }
        }

        return fetch(`${this.baseURL}/isLoggedIn`, requestOptions)
        .then(response => {
            if (response.status === 401) {
                return Promise.reject(response.statusText)
            }
            return response.json()
        })
    }

    login (username) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username })
        }
        return fetch(`${this.baseURL}/login`, requestOptions)
        .then(response => {
            if (response.status === 401) {
                this.logout()
                return Promise.reject(response.statusText)
            }
            return response.json()
        })
        .then(user => {
            localStorage.setItem('user', JSON.stringify(user))
            return `User ${username} logged in`
        })
    }

    logout () {
        localStorage.removeItem('user')
    }

    getAllTodos () {
        const user = JSON.parse(localStorage.getItem('user'))
        return fetch(this.baseURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.accessToken}`
            }
        })
        .then(response => response.json())
        .then(todos => {
            for (let todo of todos) {
                todo.date = moment(todo.date, 'DD-MM-YYYY')
            }
            return todos
        })
    }

    addTodo (todo) {
        const user = JSON.parse(localStorage.getItem('user'))
        todo = {...todo, date: todo.date.format('DD-MM-YYYY')}
        return fetch(this.baseURL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.accessToken}`
            },
            body: JSON.stringify(todo)
        })
        .then(response => response.json())
        .then(todo => ({...todo, date: moment(todo.date, 'DD-MM-YYYY')}))
    }

    removeTodo(todoId) {
        const user = JSON.parse(localStorage.getItem('user'))
        return fetch(`${this.baseURL}/${todoId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.accessToken}`
            }
        })
    }

    updateTodo(todo) {
        const user = JSON.parse(localStorage.getItem('user'))
        todo = {...todo, date: todo.date.format('DD-MM-YYYY')}
        return fetch(`${this.baseURL}/${todo.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.accessToken}`
            },
            body: JSON.stringify(todo)
        })  
    }
}

export default new API(apiUrl, wsUrl)