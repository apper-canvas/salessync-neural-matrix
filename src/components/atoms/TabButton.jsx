import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const TabButton = ({ isActive, onClick, iconName, label, className, ...props }) => {
    const baseClasses = `flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center space-x-2`;
    const activeClasses = `bg-white text-primary shadow-sm`;
    const inactiveClasses = `text-surface-600 hover:text-surface-900`;

    return (
        <button
            onClick={onClick}
            className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses} ${className || ''}`}
            {...props}
        >
            {iconName && <ApperIcon name={iconName} size={16} />}
            <span>{label}</span>
        </button>
    );
};

export default TabButton;