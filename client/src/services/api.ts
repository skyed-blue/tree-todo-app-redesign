import axios from 'axios';
import { Todo, CreateTodoInput, UpdateTodoInput } from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const todoApi = {
  getAll: async (): Promise<Todo[]> => {
    const response = await api.get('/todos');
    return response.data.data;
  },

  create: async (data: CreateTodoInput): Promise<Todo> => {
    const response = await api.post('/todos', data);
    return response.data.data;
  },

  update: async (id: string, data: UpdateTodoInput): Promise<Todo> => {
    const response = await api.put(`/todos/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/todos/${id}`);
  },

  reorder: async (items: { id: string; parentId: string | null; order: number }[]): Promise<void> => {
    await api.put('/todos/reorder', { items });
  }
};