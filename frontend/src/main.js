// Punto de entrada de la UI: conecta los validadores (TDD) y el cliente de API.

import { createTodo, deleteTodo, fetchTodos, updateTodo } from './api.js';
import { validateForm } from './validators.js';

const $ = (sel) => document.querySelector(sel);

const todoList = $('#todo-list');
const todoEmpty = $('#todo-empty');
const todoError = $('#todo-error');
const apiStatus = $('#api-status');

function showError(el, message) {
  if (!message) {
    el.classList.add('hidden');
    el.textContent = '';
    return;
  }
  el.textContent = message;
  el.classList.remove('hidden');
}

function renderTodos(todos) {
  todoList.innerHTML = '';
  todoEmpty.hidden = todos.length > 0;

  for (const todo of todos) {
    const li = document.createElement('li');
    li.className =
      'flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => {
      updateTodo(todo.id, { completed: checkbox.checked })
        .then((updated) => {
          li.classList.toggle('opacity-60', updated.completed);
          todo.completed = updated.completed;
        })
        .catch((err) => showError(todoError, err.message));
    });

    const span = document.createElement('span');
    span.textContent = todo.title;
    span.className = 'flex-1';
    if (todo.completed) {
      span.classList.add('line-through', 'text-slate-400');
    }

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Eliminar';
    delBtn.className =
      'text-sm text-red-600 hover:text-red-800 font-medium px-2 py-1 rounded hover:bg-red-50 transition';
    delBtn.addEventListener('click', () => {
      deleteTodo(todo.id)
        .then(() => loadTodos())
        .catch((err) => showError(todoError, err.message));
    });

    li.append(checkbox, span, delBtn);
    todoList.append(li);
  }
}

async function loadTodos() {
  try {
    const todos = await fetchTodos();
    renderTodos(todos);
    apiStatus.textContent = 'API conectada';
    apiStatus.className =
      'text-sm font-medium px-3 py-1 rounded-full bg-emerald-100 text-emerald-700';
  } catch (err) {
    showError(todoError, `No se pudo cargar la lista: ${err.message}`);
    apiStatus.textContent = 'API sin conexión';
    apiStatus.className =
      'text-sm font-medium px-3 py-1 rounded-full bg-red-100 text-red-700';
  }
}

$('#todo-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const input = $('#todo-input');
  const title = input.value;
  showError(todoError, '');
  createTodo(title)
    .then(() => {
      input.value = '';
      return loadTodos();
    })
    .catch((err) => showError(todoError, err.message));
});

// Validación de formulario: primero local (TDD), y se podría enviar al backend.
$('#validate-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const username = $('#v-username').value;
  const email = $('#v-email').value;
  const password = $('#v-password').value;

  const errors = validateForm(username, email, password);

  showError($('#v-username-err'), errors.username ?? '');
  showError($('#v-email-err'), errors.email ?? '');
  showError($('#v-password-err'), errors.password ?? '');

  const result = $('#v-result');
  if (Object.keys(errors).length === 0) {
    result.textContent = '✅ Formulario válido';
    result.className = 'text-sm font-medium text-emerald-600 mt-2';
  } else {
    result.textContent = '❌ Corrige los campos marcados';
    result.className = 'text-sm font-medium text-red-600 mt-2';
  }
  result.classList.remove('hidden');
});

loadTodos();