import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ErrorState = ({ message, onRetry, className }) => {
    return (
        <div className={`p-6 max-w-full overflow-hidden ${className || ''}`}>
            <div className="text-center py-12">
                <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
                <h3 className="text-lg font-medium text-surface-900 mb-2">Error</h3>
                <p className="text-surface-600 mb-4">{message}</p>
                {onRetry && (
                    <Button onClick={onRetry} variant="primary">
                        Try Again
                    </Button>
                )}
            </div>
        </div>
    );
};

export default ErrorState;