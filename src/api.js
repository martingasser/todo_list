class API {

    constructor(baseURL) {
        this.baseURL = baseURL
        this.es = new EventSource(`${this.baseURL}/events`);
        this.es.onmessage = event => {
            if (this.callback) {
                this.callback(event)
            }
        };
    }

    addUpdateListener(callback) {
        this.callback = callback
    }

    getAllTodos () {
        return fetch(this.baseURL, {
            method: 'GET'
        })
        .then(response => response.json())
    }

    addTodo (todo) {
        return this.updateTodo(todo)
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