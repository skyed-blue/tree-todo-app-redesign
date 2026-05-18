import { useQuery, useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { todoApi } from '../services/api';
import { CreateTodoInput, UpdateTodoInput } from '../types';

export function useTodos() {
  const queryClient = useQueryClient();

  const todosQuery = useQuery({
    queryKey: ['todos'],
    queryFn: todoApi.getAll
  });

  const createTodoMutation = useMutation({
    mutationFn: todoApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    }
  });

  const updateTodoMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTodoInput }) =>
      todoApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    }
  });

  const deleteTodoMutation = useMutation({
    mutationFn: todoApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    }
  });

  const reorderTodosMutation = useMutation({
    mutationFn: todoApi.reorder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    }
  });

  return {
    todos: todosQuery.data || [],
    isLoading: todosQuery.isLoading,
    error: todosQuery.error,
    createTodo: (data: CreateTodoInput, options?: UseMutationOptions<any, any, CreateTodoInput>) =>
      createTodoMutation.mutate(data, options),
    updateTodo: (id: string, data: UpdateTodoInput, options?: UseMutationOptions<any, any, { id: string; data: UpdateTodoInput }>) =>
      updateTodoMutation.mutate({ id, data }, options),
    deleteTodo: deleteTodoMutation.mutate,
    reorderTodos: reorderTodosMutation.mutate
  };
}