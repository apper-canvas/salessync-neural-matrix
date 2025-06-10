import React from 'react';

const Input = ({ 
    type = 'text', 
    value, 
    onChange, 
    placeholder, 
    className, 
    required, 
    icon: Icon,
    rightElement,
    error,
    ...props 
}) => {
    const baseClasses = 'w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary';
    const errorClasses = error ? 'border-error focus:ring-error focus:border-error' : '';
    
    const inputElement = (
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className={`${baseClasses} ${errorClasses} ${className || ''} ${Icon ? 'pl-10' : ''} ${rightElement ? 'pr-10' : ''}`}
            {...props}
        />
    );

    if (Icon || rightElement) {
        return (
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className="h-4 w-4 text-surface-400" />
                    </div>
                )}
                {inputElement}
                {rightElement && (
                    <div className="absolute inset-y-0 right-0 flex items-center">
                        {rightElement}
                    </div>
                )}
            </div>
        );
    }

    const result = (
        <div>
            {inputElement}
            {error && (
                <p className="mt-1 text-sm text-error">{error}</p>
            )}
        </div>
    );

    return result;
};

export default Input;