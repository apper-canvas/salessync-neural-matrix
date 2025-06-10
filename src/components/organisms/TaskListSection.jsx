import React from 'react';
import TaskListItem from './TaskListItem';
import EmptyState from '@/components/molecules/EmptyState';
import ApperIcon from '@/components/ApperIcon';

const TaskListSection = ({ tasks, filter, onComplete, onEdit, onDelete, onAddTaskClick }) => {
    const getEmptyStateMessage = () => {
        switch (filter) {
            case 'all': return { title: 'No tasks yet', message: 'Create your first task to get started', icon: 'CheckSquare', actionText: 'Create Task', actionFn: onAddTaskClick };
            case 'pending': return { title: 'No pending tasks', message: 'All tasks are completed!', icon: 'CheckSquare' };
            case 'completed': return { title: 'No completed tasks', message: 'Complete some tasks to see them here', icon: 'CheckSquare' };
            default: return { title: 'No tasks found', message: 'Adjust your filters or add new tasks.', icon: 'CheckSquare' };
        }
    };

    const emptyState = getEmptyStateMessage();

    if (tasks.length === 0) {
        return (
            <EmptyState
                iconName={emptyState.icon}
                title={emptyState.title}
                message={emptyState.message}
                actionButtonText={emptyState.actionText}
                onActionButtonClick={emptyState.actionFn}
            />
        );
    }

    return (
        <div className="space-y-3">
            {tasks.map((task, index) => (
                <TaskListItem
                    key={task.id}
                    task={task}
                    onComplete={onComplete}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    index={index}
                />
            ))}
        </div>
    );
};

export default TaskListSection;