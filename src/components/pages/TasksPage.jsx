import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import LoadingState from '@/components/molecules/LoadingState';
import ErrorState from '@/components/molecules/ErrorState';
import PageHeader from '@/components/organisms/PageHeader';
import TaskFilters from '@/components/organisms/TaskFilters';
import TaskListSection from '@/components/organisms/TaskListSection';
import TaskEditorForm from '@/components/organisms/TaskEditorForm';
import QuickAddFeature from '@/components/organisms/QuickAddFeature';
import TaskService from '@/services/api/TaskService';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await TaskService.getAll();
      setTasks(result);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleSaveSuccess = (savedTask) => {
    if (editingTask) {
      setTasks(tasks.map(t => t.id === savedTask.id ? savedTask : t));
    } else {
      setTasks([...tasks, savedTask]);
    }
  };

  const handleComplete = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      const updatedTask = await TaskService.update(taskId, { 
        ...task, 
        completed: !task.completed 
      });
      
      setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
      toast.success(updatedTask.completed ? 'Task completed!' : 'Task reopened');
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await TaskService.delete(taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
      toast.success('Task deleted successfully');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const openNewTaskForm = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case 'pending':
        return !task.completed;
      case 'completed':
        return task.completed;
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <LoadingState>
        <div className="h-8 bg-surface-200 rounded w-1/4"></div>
        <div className="flex space-x-4 mb-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 bg-surface-200 rounded w-24"></div>
          ))}
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-4 shadow-sm">
            <div className="h-4 bg-surface-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-surface-100 rounded w-1/2"></div>
          </div>
        ))}
      </LoadingState>
    );
  }

  if (error) {
    return (
      <ErrorState message={error} onRetry={loadTasks} />
    );
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <PageHeader
        title="Tasks"
        onAddClick={openNewTaskForm}
        addButtonText="Add Task"
        addButtonIcon="Plus"
        data-action="create-task" // For quick add feature to target
      />

      <TaskFilters filter={filter} setFilter={setFilter} />

      <TaskListSection
        tasks={filteredTasks}
        filter={filter}
        onComplete={handleComplete}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddTaskClick={openNewTaskForm}
      />

      <TaskEditorForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        editingTask={editingTask}
        onSaveSuccess={handleSaveSuccess}
      />
      
      <QuickAddFeature />
    </div>
  );
};

export default TasksPage;