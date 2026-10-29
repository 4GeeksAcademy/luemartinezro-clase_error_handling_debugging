import { afterEach, describe, expect, it, vi } from 'vitest';

import { createTodo, deleteTodo, fetchTodos, updateTodo } from './api.js';

const base = '/api';

function mockFetchOnce(status, body, headers = {}) {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
    headers: new Headers(headers),
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('fetchTodos', () => {
  it('devuelve la lista de tareas del backend', async () => {
    mockFetchOnce(200, [{ id: 1, title: 'Hacer TDD', completed: false }]);
    const todos = await fetchTodos();
    expect(globalThis.fetch).toHaveBeenCalledWith(`${base}/todos`);
    expect(todos).toEqual([{ id: 1, title: 'Hacer TDD', completed: false }]);
  });

  it('lanza un error si la respuesta no es ok', async () => {
    mockFetchOnce(500, { detail: 'boom' });
    await expect(fetchTodos()).rejects.toThrow();
  });
});

describe('createTodo', () => {
  it('envía POST y devuelve la tarea creada', async () => {
    mockFetchOnce(201, { id: 2, title: 'Nueva', completed: false });
    const todo = await createTodo('Nueva');
    expect(globalThis.fetch).toHaveBeenCalledWith(
      `${base}/todos`,
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      }),
    );
    expect(todo).toEqual({ id: 2, title: 'Nueva', completed: false });
  });

  it('lanza error si el título está vacío', async () => {
    await expect(createTodo('   ')).rejects.toThrow();
  });
});

describe('updateTodo', () => {
  it('envía PUT y devuelve la tarea actualizada', async () => {
    mockFetchOnce(200, { id: 1, title: 'Cambiada', completed: true });
    const todo = await updateTodo(1, { completed: true });
    expect(globalThis.fetch).toHaveBeenCalledWith(
      `${base}/todos/1`,
      expect.objectContaining({ method: 'PUT' }),
    );
    expect(todo.completed).toBe(true);
  });
});

describe('deleteTodo', () => {
  it('envía DELETE sin lanzar error cuando responde 204', async () => {
    mockFetchOnce(204, null);
    await expect(deleteTodo(1)).resolves.toBeUndefined();
    expect(globalThis.fetch).toHaveBeenCalledWith(
      `${base}/todos/1`,
      expect.objectContaining({ method: 'DELETE' }),
    );
  });

  it('lanza error si el servidor devuelve 404', async () => {
    mockFetchOnce(404, { detail: 'Todo no encontrado' });
    await expect(deleteTodo(999)).rejects.toThrow();
  });
});