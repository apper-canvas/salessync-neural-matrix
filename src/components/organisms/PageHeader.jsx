import React from 'react';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const PageHeader = ({ title, onAddClick, addButtonText, addButtonIcon, className, children }) => {
    return (
        <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 ${className || ''}`}>
            <h1 className="font-heading text-2xl font-bold text-surface-900 mb-4 sm:mb-0">{title}</h1>
            {onAddClick && addButtonText && (
                <Button onClick={onAddClick} variant="secondary" icon={addButtonIcon && <ApperIcon name={addButtonIcon} size={16} />}>
                    {addButtonText}
                </Button>
            )}
            {children}
        </div>
    );
};

export default PageHeader;