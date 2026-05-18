import React, { useState, useCallback, useMemo } from 'react';
import { Alert } from 'antd';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { Todo } from '../../types';
import { useTodos } from '../../hooks/useTodos';
import TodoNode from './TodoNode';
import './TodoTree.css';

function flattenTree(todos: Todo[], parentId: string | null = null): Todo[] {
  let result: Todo[] = [];
  todos.forEach(todo => {
    result.push({ ...todo, parentId });
    if (todo.children && todo.children.length > 0) {
      result = [...result, ...flattenTree(todo.children, todo.id)];
    }
  });
  return result;
}

function groupByParent(todos: Todo[]): Record<string, Todo[]> {
  const groups: Record<string, Todo[]> = {};
  todos.forEach(todo => {
    const key = todo.parentId || 'root';
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(todo);
  });
  return groups;
}

const TodoTree: React.FC = () => {
  const { todos, isLoading, error, reorderTodos } = useTodos();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [localTodos, setLocalTodos] = useState<Todo[]>([]);

  React.useEffect(() => {
    if (todos.length > 0) {
      setLocalTodos(todos);
    }
  }, [todos]);

  const flattenedTodos = useMemo(() => 
    flattenTree(localTodos), [localTodos]);

  const groups = useMemo(() => 
    groupByParent(flattenedTodos), [flattenedTodos]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    if (active.id === over.id) {
      setActiveId(null);
      return;
    }

    const activeTodo = flattenedTodos.find(t => t.id === active.id);
    const overTodo = flattenedTodos.find(t => t.id === over.id);

    if (!activeTodo || !overTodo) {
      setActiveId(null);
      return;
    }

    const activeParentId = activeTodo.parentId || 'root';
    const overParentId = overTodo.parentId || 'root';

    if (activeParentId === overParentId) {
      const items = groups[activeParentId];
      const oldIndex = items.findIndex(t => t.id === active.id);
      const newIndex = items.findIndex(t => t.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedItems = arrayMove(items, oldIndex, newIndex);
        
        const reorderData = reorderedItems.map((item, index) => ({
          id: item.id,
          parentId: item.parentId,
          order: index
        }));

        reorderTodos(reorderData);
      }
    } else {
      const reorderData = [
        {
          id: activeTodo.id,
          parentId: overTodo.parentId,
          order: 0
        }
      ];

      const siblings = groups[overParentId].filter(t => t.id !== activeTodo.id);
      siblings.forEach((item, index) => {
        reorderData.push({
          id: item.id,
          parentId: item.parentId,
          order: index + 1
        });
      });

      reorderTodos(reorderData);
    }

    setActiveId(null);
  }, [flattenedTodos, groups, reorderTodos]);

  const renderTree = (todos: Todo[], level: number = 0) => {
    return todos.map((todo, index) => (
      <TodoNode 
        key={todo.id} 
        todo={todo} 
        level={level}
        animationDelay={index * 100}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
        <p className="loading-text">加载中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert 
        message="加载失败" 
        type="error" 
        className="custom-alert"
        showIcon 
      />
    );
  }

  const rootTodos = localTodos.filter(t => t.parentId === null);
  const rootIds = rootTodos.map(t => t.id);

  if (rootTodos.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-illustration">
          <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="60" cy="60" r="50" stroke="var(--border-accent)" strokeWidth="2" strokeDasharray="8 4"/>
            <path d="M60 35 L60 75" stroke="var(--accent-teal)" strokeWidth="3" strokeLinecap="round"/>
            <path d="M60 55 L45 55" stroke="var(--accent-coral)" strokeWidth="3" strokeLinecap="round"/>
            <path d="M60 65 L75 65" stroke="var(--accent-violet)" strokeWidth="3" strokeLinecap="round"/>
            <circle cx="60" cy="35" r="5" fill="var(--accent-teal)"/>
            <circle cx="45" cy="55" r="4" fill="var(--accent-coral)"/>
            <circle cx="75" cy="65" r="4" fill="var(--accent-violet)"/>
          </svg>
        </div>
        <h3 className="empty-title">暂无待办事项</h3>
        <p className="empty-description">点击右上角 "新建待办" 开始创建你的第一个任务</p>
        <div className="empty-hint">
          <svg viewBox="0 0 24 24" fill="none" className="hint-icon">
            <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>开始创建</span>
        </div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={rootIds}
        strategy={verticalListSortingStrategy}
      >
        <div className="todo-tree-container">
          {renderTree(rootTodos)}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeId ? (
          <div className="drag-overlay">
            <div className="drag-content">
              <div className="drag-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="drag-title">
                {flattenedTodos.find(t => t.id === activeId)?.title || '移动中...'}
              </span>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default TodoTree;