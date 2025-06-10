import React from 'react';

const LoadingState = ({ children, className }) => {
    return (
        <div className={`p-6 max-w-full overflow-hidden ${className || ''}`}>
            <div className="animate-pulse space-y-4">
                {children}
            </div>
        </div>
    );
};

export default LoadingState;