import moment from 'moment'

class API {
    constructor(baseURL) {
        this.baseURL = baseURL
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