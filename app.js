
    //Globals
    const todoList = document.getElementById('todo-list');
    const userSelect = document.getElementById('user-todo');
    const form = document.querySelector('form');
    let todos = [];
    let users = [];

// Attach Events
    document.addEventListener('DOMContentLoaded', initApp);
    form.addEventListener('submit', handleSubmit)


// Basic login

    function getUserName(userId) {
        const user = users.find(user => user.id === userId)

        return user.name;

    }


    function printTodo({id, userId, title, completed}) {
        const li = document.createElement('li');
        li.className = 'todo-item';
        li.dataset.id = id;
        li.innerHTML = `<span>${title} <i>by</i> <b>${getUserName(userId)}</b></span>`;

        const status = document.createElement('input')
        status.type = 'checkbox';
        status.checked = completed;
        status.addEventListener('change', handleToDoChange);


        const close = document.createElement('span');
        close.innerHTML = '&times;';
        close.className = 'close';
        close.addEventListener('click', handleClose);

        li.prepend(status);
        li.append(close);


        todoList.prepend(li);
    }

    function handleClose() {
        const todoId = this.parentElement.dataset.id;
        deleteTodo(todoId);
    }

    function handleToDoChange() {
        const todoId = this.parentElement.dataset.id;
        const completed = this.checked;

        toggleTodoComplete(todoId, completed);
    }


    function createUserOption(user) {
        const option = document.createElement('option');
        option.value = user.id;
        option.innerText = user.name;
        userSelect.append(option);
    }

    function removeToDo(todoId) {
        todos = todos.filter(todo => todo.id !== todoId);
        console.log(1);
        const todo = todoList.querySelector(`[data-id="${todoId}"]`)
        todo.querySelector('input').removeEventListener('change', handleToDoChange)
        todo.querySelector('.close').removeEventListener('click', handleClose)
        todo.remove();
    }

    function alertError(error) {
        alert(error.message);
    }

// Event Logic
    function initApp() {
        Promise.all([getAllTodos(),getAllUsers() ]).then(values => {
            [todos, users] = values;
            console.log(todos, users)

            todos.forEach(todo => printTodo(todo));
            users.forEach(user => createUserOption(user));
        })
        // Отправить в разметку

    }

    function handleSubmit(event) {
        event.preventDefault();

        createTodo({
            userId: Number(form.user.value),
            title: form.todo.value,
            completed: false,
        });
    }




// Async logic

    async function getAllTodos() {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=10');
            const data = await response.json();

            return data;
        }catch (error) {
            alertError(error)
        }

    }


    async function getAllUsers() {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/users');
            const data = await response.json();

            return data;
        } catch (error) {
            alertError(error)
        }

    }

    async function createTodo(todo) {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
                method: 'POST',
                body: JSON.stringify(todo),
                headers: {
                    'Content-type': 'application/json',
                },
            });

            const newTodo = await response.json()
            console.log(todo);

            printTodo(newTodo);
        } catch (error) {
            alertError(error)
        }

    }

    async function toggleTodoComplete(todoId, completed) {
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
                method: 'PATCH',
                body: JSON.stringify({completed: completed}),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            // const data = await response.json();
            // console.log(data);

            if(!response.ok) {
                throw new Error('Failed to connect with server! Please try later')
            }
        } catch (error) {
            alertError(error)
        }

    }

    async function deleteTodo(todoId) {
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`,{
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            if(response.ok) {
                removeToDo(todoId);
            } else {
                throw new Error('Failed to connect with server! Please try later')
            }
        } catch (error) {
            alertError(error);
        }

    }

