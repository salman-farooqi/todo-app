"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const todoName = document.getElementById("todo-name");
    const todoTask = document.getElementById("todo-task");
    const addBtn = document.querySelector(".dashboard__creds .btn");
    const todosContainerEl = document.getElementById("todos");
    const todosCount = document.querySelector(".todos-count");
    const progressBars = document.querySelector(".progress-bars");
    const activeClass = "todo-active";
    const todosTitle = document.querySelector(".todos-title");

    let todoCounter = 0; // Counter for generating unique IDs for todos
    let allTodos = [];

    // Function to create a new todo object
    const createTodo = (name, task) => {
        const names = name.split(" ");
        const shortName =
            names.length === 1
                ? names[0][0].toUpperCase() +
                  (names[0][1] ? names[0][1].toLowerCase() : "")
                : names[0][0].toUpperCase() +
                  (names[names.length - 1][0].toUpperCase() || "");

        const uniqueId = `todo_${todoCounter++}`; // Generating a unique ID for the todo

        return {
            id: uniqueId,
            name,
            task,
            isCompleted: false,
            isDeleted: false,
            shortName,
        };
    };

    // Function to update the title of the current tab
    const updateTabTitle = (title) => {
        todosTitle.textContent = title;
    };

    // Function to render todos based on the active tab
    const renderTodos = () => {
        const activeTab = progressBars.querySelector(
            `.${activeClass}`
        ).classList;
        let filteredTodos;

        if (activeTab.contains("progress-bars__all")) {
            filteredTodos = allTodos;
            updateTabTitle("All Todos");
        } else if (activeTab.contains("progress-bars__incompleted")) {
            filteredTodos = allTodos.filter(
                (todo) => !todo.isCompleted && !todo.isDeleted
            );
            updateTabTitle("Pending Todos");
        } else if (activeTab.contains("progress-bars__completed")) {
            filteredTodos = allTodos.filter(
                (todo) => todo.isCompleted && !todo.isDeleted
            );
            updateTabTitle("Completed Todos");
        } else if (activeTab.contains("progress-bars__deleted")) {
            filteredTodos = allTodos.filter((todo) => todo.isDeleted);
            updateTabTitle("Deleted Todos");
        }

        const allTodosHTMLs = filteredTodos.map(getTodoHTML).join("");
        todosContainerEl.innerHTML = allTodosHTMLs;
        todosCount.innerHTML = filteredTodos.length;
        addTodoEventListeners();
    };

    // Function to generate HTML for a todo
    const getTodoHTML = (todo) => {
        const backgroundColor = todo.isCompleted ? "#e4f8e5" : "#fff";
        const actionsClass = todo.isDeleted ? "hidden" : "";

        let statusText = "";
        let statusContainerClass = "";

        if (todo.isDeleted) {
            statusText = "Deleted";
            statusContainerClass = "todo__status-container--deleted";
        } else if (todo.isCompleted) {
            statusText = "Completed";
            statusContainerClass = "todo__status-container--completed";
        } else {
            statusText = "Active";
            statusContainerClass = "todo__status-container--active";
        }

        return `
    <div class="todo" data-id="${
        todo.id
    }" style="background-color: ${backgroundColor};">
        <div class="todo__initials">${todo.shortName}</div>
        <div class="todo__name">${todo.name}</div>
        <div class="todo__task">${todo.task}</div>
        <div class="todo__status-container">
            <div class="${statusContainerClass}">
                ${statusText}
            </div>
        </div>
        <div class="todo__actions ${actionsClass}">
            <div class="todo__actions-delete">
                <img src="/images/delete-icon.svg" />
            </div>
            <div class="todo__actions-state">
                <img src="/images/${
                    todo.isCompleted ? "completed" : "incomplete"
                }-icon.svg" />
            </div>
        </div>
    </div>`;
    };

    // Function to handle the addition of a new todo
    const handleNewTodoAdd = () => {
        const userName = todoName.value;
        const userTask = todoTask.value;

        if (userName.trim() === "" || userTask.trim() === "") {
            return;
        }

        const newTodo = createTodo(userName, userTask);
        allTodos.push(newTodo);
        renderTodos();

        todoName.value = "";
        todoTask.value = "";
    };

    // Function to handle the completion of a todo
    const handleCompleteTodo = (id) => {
        const todo = allTodos.find((t) => t.id === id);
        if (todo && !todo.isDeleted) {
            todo.isCompleted = !todo.isCompleted;
            renderTodos();
        }
    };

    // Function to handle the deletion of a todo
    const handleDeleteTodo = (id) => {
        const todo = allTodos.find((t) => t.id === id);
        if (todo) {
            todo.isDeleted = true;
            todo.statusContainerClass = "todo__status-container--deleted";
            todo.statusText = "Deleted";
            renderTodos();
        }
    };

    // Function to add event listeners for todo actions
    const addTodoEventListeners = () => {
        const deleteButtons = document.querySelectorAll(
            ".todo__actions-delete"
        );
        const completeButtons = document.querySelectorAll(
            ".todo__actions-state"
        );

        deleteButtons.forEach((deleteButton) => {
            deleteButton.addEventListener("click", (event) => {
                const todoElement = event.target.closest(".todo");
                if (todoElement) {
                    const id = todoElement.dataset.id;
                    handleDeleteTodo(id);
                }
            });
        });

        completeButtons.forEach((completeButton) => {
            completeButton.addEventListener("click", (event) => {
                const todoElement = event.target.closest(".todo");
                if (todoElement) {
                    const id = todoElement.dataset.id;
                    handleCompleteTodo(id);
                }
            });
        });
    };

    // Event listener for tab clicks
    progressBars.addEventListener("click", function (event) {
        const target = event.target;

        if (
            target.classList.contains("progress-bars__all") ||
            target.classList.contains("progress-bars__incompleted") ||
            target.classList.contains("progress-bars__completed") ||
            target.classList.contains("progress-bars__deleted")
        ) {
            progressBars
                .querySelector(`.${activeClass}`)
                .classList.remove(activeClass);
            target.classList.add(activeClass);
            renderTodos();
        }
    });

    // Event listener for adding a new todo
    addBtn.addEventListener("click", handleNewTodoAdd);

    // Function to update the Clock and Date
    const updateClockAndDate = () => {
        const timer = document.getElementById("timer");
        const timeElement = timer.querySelector(".time");
        const dateElement = timer.querySelector(".date");

        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        const formattedTime = formatTime(hours, minutes, seconds);
        const formattedDate = formatDate(now);

        timeElement.textContent = formattedTime;
        dateElement.textContent = formattedDate;
    };

    // Function to format time
    const formatTime = (hours, minutes, seconds) => {
        const ampm = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 || 12;
        const formattedMinutes = String(minutes).padStart(2, "0");
        const formattedSeconds = String(seconds).padStart(2, "0");

        return `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;
    };

    // Function to format date
    const formatDate = (date) => {
        const options = { day: "numeric", month: "short", year: "numeric" };
        return date.toLocaleDateString("en-US", options);
    };

    // Initial clock and date update
    updateClockAndDate();
    // Set interval to update clock and date every second
    setInterval(updateClockAndDate, 1000);
});
