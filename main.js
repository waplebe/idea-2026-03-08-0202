document.addEventListener('DOMContentLoaded', function() {
    const newTaskButton = document.getElementById('newTaskButton');
    const taskContainer = document.getElementById('taskContainer');

    // Fetch tasks from the API
    fetch('/tasks')
        .then(response => response.json())
        .then(tasks => {
            taskContainer.innerHTML = ''; // Clear previous tasks
            tasks.forEach(task => {
                const taskElement = document.createElement('div');
                taskElement.innerHTML = `
                    <p>${task.title} - ${task.description}</p>
                    <p>Completed: ${task.completed ? 'Yes' : 'No'}</p>
                    <button class="edit-task-button" data-id="${task.id}">Edit</button>
                    <button class="delete-task-button" data-id="${task.id}">Delete</button>
                `;
                taskContainer.appendChild(taskElement);
            });
        })
        .catch(error => console.error('Error fetching tasks:', error));

    // Add new task functionality
    newTaskButton.addEventListener('click', () => {
        const title = prompt("Enter task title:");
        const description = prompt("Enter task description:");

        if (title && description) {
            fetch('/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: title, description: description })
            })
            .then(response => response.json())
            .then(newTask => {
                taskContainer.innerHTML = '';
                fetch('/tasks')
                    .then(response => response.json())
                    .then(tasks => {
                        tasks.forEach(task => {
                            const taskElement = document.createElement('div');
                            taskElement.innerHTML = `
                                <p>${task.title} - ${task.description}</p>
                                <p>Completed: ${task.completed ? 'Yes' : 'No'}</p>
                                <button class="edit-task-button" data-id="${task.id}">Edit</button>
                                <button class="delete-task-button" data-id="${task.id}">Delete</button>
                            `;
                            taskContainer.appendChild(taskElement);
                        });
                    });
            });
        }
    });

    // Edit task functionality
    taskContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('edit-task-button')) {
            const taskId = parseInt(event.target.dataset.id);
            const task = Task.get_by_id(taskId);
            if (task) {
                const title = prompt("Edit task title:", task.title);
                const description = prompt("Edit task description:", task.description);

                if (title !== null && description !== null) {
                    fetch(`/tasks/${taskId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ title: title, description: description })
                    })
                    .then(response => response.json())
                    .then(updatedTask => {
                        taskContainer.innerHTML = '';
                        fetch('/tasks')
                            .then(response => response.json())
                            .then(tasks => {
                                tasks.forEach(task => {
                                    const taskElement = document.createElement('div');
                                    taskElement.innerHTML = `
                                        <p>${task.title} - ${task.description}</p>
                                        <p>Completed: ${task.completed ? 'Yes' : 'No'}</p>
                                        <button class="edit-task-button" data-id="${task.id}">Edit</button>
                                        <button class="delete-task-button" data-id="${task.id}">Delete</button>
                                    `;
                                    taskContainer.appendChild(taskElement);
                                });
                            });
                    });
                }
            }
        }
    });

    // Delete task functionality
    taskContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-task-button')) {
            const taskId = parseInt(event.target.dataset.id);
            if (confirm("Are you sure you want to delete this task?")) {
                fetch(`/tasks/${taskId}`, {
                    method: 'DELETE'
                })
                .then(() => {
                    taskContainer.innerHTML = '';
                    fetch('/tasks')
                        .then(response => response.json())
                        .then(tasks => {
                            tasks.forEach(task => {
                                const taskElement = document.createElement('div');
                                taskElement.innerHTML = `
                                    <p>${task.title} - ${task.description}</p>
                                    <p>Completed: ${task.completed ? 'Yes' : 'No'}</p>
                                    <button class="edit-task-button" data-id="${task.id}">Edit</button>
                                    <button class="delete-task-button" data-id="${task.id}">Delete</button>
                                `;
                                taskContainer.appendChild(taskElement);
                            });
                        });
                });
            }
        }
    });
});