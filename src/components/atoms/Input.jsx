import React from 'react';

const Input = ({ type = 'text', value, onChange, placeholder, className, required, ...props }) => {
    const baseClasses = 'w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary';
    
    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className={`${baseClasses} ${className || ''}`}
            {...props}
        />
    );
};

export default Input;