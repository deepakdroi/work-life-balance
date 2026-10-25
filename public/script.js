const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

// Fetch and render todos on load
async function fetchTodos() {
    const res = await fetch('/todos');
    const todos = await res.json();
    renderTodos(todos);
}

function renderTodos(todos) {
    todoList.innerHTML = '';
    todos.forEach(todo => {
        const li = document.createElement('li');
        if (todo.completed) li.classList.add('completed');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => toggleTodo(todo.id, checkbox.checked));

        const span = document.createElement('span');
        span.classList.add('todo-text');
        span.textContent = todo.title;

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.textContent = 'X';
        deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    });
}

// Add new todo
todoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = todoInput.value.trim();
    if (!title) return;

    await fetch('/todos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title })
    });

    todoInput.value = '';
    fetchTodos();
});

// Toggle todo completion
async function toggleTodo(id, completed) {
    await fetch(`/todos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ completed })
    });
    fetchTodos();
}

// Delete todo
async function deleteTodo(id) {
    await fetch(`/todos/${id}`, {
        method: 'DELETE'
    });
    fetchTodos();
}

fetchTodos();
