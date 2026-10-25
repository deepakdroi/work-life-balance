const express = require('express');
const NodeCache = require('node-cache');
const path = require('path');

const app = express();
const port = 3000;
const cache = new NodeCache();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize empty array in cache if not exists
if (!cache.has('todos')) {
    cache.set('todos', []);
}

// GET all todos
app.get('/todos', (req, res) => {
    const todos = cache.get('todos');
    res.json(todos);
});

// POST a new todo
app.post('/todos', (req, res) => {
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }

    const todos = cache.get('todos');
    const newTodo = {
        id: Date.now().toString(),
        title,
        completed: false
    };

    todos.push(newTodo);
    cache.set('todos', todos);

    res.status(201).json(newTodo);
});

// PUT (update) a todo
app.put('/todos/:id', (req, res) => {
    const { id } = req.params;
    const { title, completed } = req.body;

    const todos = cache.get('todos');
    const index = todos.findIndex(t => t.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Todo not found' });
    }

    if (title !== undefined) todos[index].title = title;
    if (completed !== undefined) todos[index].completed = completed;

    cache.set('todos', todos);
    res.json(todos[index]);
});

// DELETE a todo
app.delete('/todos/:id', (req, res) => {
    const { id } = req.params;
    const todos = cache.get('todos');
    const index = todos.findIndex(t => t.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Todo not found' });
    }

    todos.splice(index, 1);
    cache.set('todos', todos);

    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
