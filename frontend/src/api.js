// Cliente de la API REST del backend FastAPI.
// Todas las peticiones usan rutas relativas (`/api/...`), que Vite
// reenvía al backend vía proxy en desarrollo.

const BASE = '/api';

async function request(path, options) {
  const hasOptions = options && Object.keys(options).length > 0;
  const resp = hasOptions ? await fetch(`${BASE}${path}`, options) : await fetch(`${BASE}${path}`);
  if (!resp.ok) {
    let detail = `Error ${resp.status}`;
    try {
      const body = await resp.json();
      if (body.detail) detail = body.detail;
    } catch {
      // sin cuerpo JSON: usamos el mensaje genérico
    }
    throw new Error(detail);
  }
  if (resp.status === 204) {
    return undefined;
  }
  return resp.json();
}

export function fetchTodos() {
  return request('/todos');
}

export function createTodo(title) {
  if (!title.trim()) {
    return Promise.reject(new Error('El título no puede estar vacío'));
  }
  return request('/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
}

export function updateTodo(id, changes) {
  return request(`/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(changes),
  });
}

export function deleteTodo(id) {
  return request(`/todos/${id}`, { method: 'DELETE' });
}