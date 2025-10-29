let tasks = [];
let currentFilter = 'all';

// Загружаем задачи при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    renderTasks();
    updateTaskCount();
});

// Функция добавления новой задачи
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const text = taskInput.value.trim();
    
    if (text === '') {
        alert('Введите текст задачи!');
        return;
    }
    
    const newTask = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toLocaleDateString('ru-RU')
    };
    
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    updateTaskCount();
    
    taskInput.value = '';
    taskInput.focus();
}

// Добавление задачи по Enter
document.getElementById('taskInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Функция отображения задач
function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    let filteredTasks = tasks;
    
    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
                   onchange="toggleTask(${task.id})">
            <span class="task-text">${task.text}</span>
            <small style="margin: 0 15px; color: #666;">${task.createdAt}</small>
            <button class="delete-btn" onclick="deleteTask(${task.id})">✕</button>
        `;
        taskList.appendChild(li);
    });
}

// Переключение статуса задачи
function toggleTask(id) {
    tasks = tasks.map(task => 
        task.id === id ? {...task, completed: !task.completed} : task
    );
    saveTasks();
    renderTasks();
    updateTaskCount();
}

// Удаление задачи
function deleteTask(id) {
    if (confirm('Удалить эту задачу?')) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
        updateTaskCount();
    }
}

// Фильтрация задач
function filterTasks(filter) {
    currentFilter = filter;
    renderTasks();
    
    // Обновляем активную кнопку фильтра
    document.querySelectorAll('.filters button').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

// Обновление счетчика задач
function updateTaskCount() {
    const activeTasks = tasks.filter(task => !task.completed).length;
    document.getElementById('taskCount').textContent = activeTasks;
}

// Очистка выполненных задач
function clearCompleted() {
    if (confirm('Удалить все выполненные задачи?')) {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
        updateTaskCount();
    }
}

// Сохранение задач в LocalStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}