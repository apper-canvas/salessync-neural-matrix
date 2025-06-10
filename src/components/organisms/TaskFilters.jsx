import React from 'react';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const TaskFilters = ({ filter, setFilter }) => {
    const filters = [
        { id: 'all', label: 'All Tasks', icon: 'List' },
        { id: 'pending', label: 'Pending', icon: 'Clock' },
        { id: 'completed', label: 'Completed', icon: 'CheckCircle' }
    ];

    return (
        <div className="flex space-x-2 mb-6 overflow-x-auto">
            {filters.map(filterOption => (
                <Button
                    key={filterOption.id}
                    onClick={() => setFilter(filterOption.id)}
                    className={`whitespace-nowrap ${filter === filterOption.id ? 'bg-primary text-white' : 'bg-surface-100 text-surface-700 hover:bg-surface-200'}`}
                    icon={<ApperIcon name={filterOption.icon} size={16} />}
                >
                    {filterOption.label}
                </Button>
            ))}
        </div>
    );
};

export default TaskFilters;