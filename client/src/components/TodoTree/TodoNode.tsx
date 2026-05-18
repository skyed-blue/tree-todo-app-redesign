import React, { useState } from 'react';
import { Checkbox, Tooltip, Popconfirm } from 'antd';
import { 
  DownOutlined, 
  RightOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  PlusOutlined 
} from '@ant-design/icons';
import { Todo } from '../../types';
import { useTodos } from '../../hooks/useTodos';
import EditTodoModal from '../TodoForm/EditTodoModal';
import CreateTodoModal from '../TodoForm/CreateTodoModal';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './TodoNode.css';

interface TodoNodeProps {
  todo: Todo;
  level: number;
  animationDelay?: number;
}

const TodoNode: React.FC<TodoNodeProps> = ({ todo, level, animationDelay = 0 }) => {
  const [expanded, setExpanded] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const { updateTodo, deleteTodo } = useTodos();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginLeft: `${level * 32}px`,
    animationDelay: `${animationDelay}ms`,
  };

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'high': 
        return { 
          color: 'var(--priority-high)', 
          label: '高',
          glow: 'var(--accent-coral-glow)'
        };
      case 'medium': 
        return { 
          color: 'var(--priority-medium)', 
          label: '中',
          glow: 'var(--accent-amber-glow)'
        };
      case 'low': 
        return { 
          color: 'var(--priority-low)', 
          label: '低',
          glow: 'rgba(107, 114, 128, 0.3)'
        };
      default: 
        return { 
          color: 'var(--priority-medium)', 
          label: '中',
          glow: 'var(--accent-amber-glow)'
        };
    }
  };

  const handleToggleComplete = (checked: boolean) => {
    updateTodo(todo.id, { completed: checked });
  };

  const handleDelete = () => {
    deleteTodo(todo.id);
  };

  const hasChildren = todo.children && todo.children.length > 0;
  const priorityConfig = getPriorityConfig(todo.priority);

  return (
    <>
      <div 
        ref={setNodeRef} 
        style={style}
        {...attributes}
        {...listeners}
        className={`todo-node ${todo.completed ? 'completed' : ''} ${isDragging ? 'dragging' : ''}`}
      >
        <div className="todo-node-content">
          <div className="todo-left">
            {hasChildren ? (
              <button
                className="expand-button"
                onClick={() => setExpanded(!expanded)}
                aria-label={expanded ? '收起' : '展开'}
              >
                {expanded ? <DownOutlined /> : <RightOutlined />}
              </button>
            ) : (
              <div className="expand-placeholder" />
            )}

            <div className="checkbox-wrapper" onClick={(e) => e.stopPropagation()}>
              <Checkbox
                checked={todo.completed}
                onChange={(e) => handleToggleComplete(e.target.checked)}
                className="custom-checkbox"
              />
              <div className={`checkbox-glow ${todo.completed ? 'checked' : ''}`}></div>
            </div>

            <div className="priority-badge" style={{ '--glow-color': priorityConfig.glow } as React.CSSProperties}>
              <span className="priority-dot" style={{ background: priorityConfig.color }}></span>
              <span className="priority-text" style={{ color: priorityConfig.color }}>{priorityConfig.label}</span>
            </div>

            <div className="todo-text-wrapper">
              <span className={`todo-title ${todo.completed ? 'completed' : ''}`}>
                {todo.title}
              </span>
              {todo.description && (
                <span className="todo-description">
                  {todo.description}
                </span>
              )}
            </div>
          </div>

          <div className="todo-actions">
            <Tooltip title="添加子任务" placement="top">
              <button
                className="action-button add"
                onClick={(e) => {
                  e.stopPropagation();
                  setCreateModalOpen(true);
                }}
                aria-label="添加子任务"
              >
                <PlusOutlined />
              </button>
            </Tooltip>
            
            <Tooltip title="编辑" placement="top">
              <button
                className="action-button edit"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditModalOpen(true);
                }}
                aria-label="编辑"
              >
                <EditOutlined />
              </button>
            </Tooltip>
            
            <Popconfirm
              title="确定要删除这个待办吗？"
              description="这将同时删除所有子任务"
              onConfirm={handleDelete}
              okText="确定"
              cancelText="取消"
              overlayClassName="custom-popconfirm"
            >
              <Tooltip title="删除" placement="top">
                <button
                  className="action-button delete"
                  onClick={(e) => e.stopPropagation()}
                  aria-label="删除"
                >
                  <DeleteOutlined />
                </button>
              </Tooltip>
            </Popconfirm>
          </div>
        </div>

        {hasChildren && (
          <div className={`tree-connector ${expanded ? 'expanded' : ''}`}>
            <div className="connector-line" style={{ left: `${16 + level * 32}px` }}></div>
          </div>
        )}
      </div>

      {hasChildren && expanded && todo.children!.map((child, index) => (
        <TodoNode 
          key={child.id} 
          todo={child} 
          level={level + 1}
          animationDelay={animationDelay + (index + 1) * 50}
        />
      ))}

      <EditTodoModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        todo={todo}
      />

      <CreateTodoModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        parentId={todo.id}
      />
    </>
  );
};

export default TodoNode;