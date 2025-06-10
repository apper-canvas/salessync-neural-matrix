import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const EmptyState = ({ iconName, title, message, actionButtonText, onActionButtonClick, className }) => {
    return (
        <div className={`text-center py-12 ${className || ''}`}>
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
            >
                <ApperIcon name={iconName} className="w-16 h-16 text-surface-300 mx-auto" />
            </motion.div>
            <h3 className="mt-4 text-lg font-medium text-surface-900">{title}</h3>
            <p className="mt-2 text-surface-500">{message}</p>
            {onActionButtonClick && actionButtonText && (
                <div className="mt-6">
                    <Button onClick={onActionButtonClick} variant="primary">
                        {actionButtonText}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default EmptyState;