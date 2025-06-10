import React from 'react';

const Select = ({ value, onChange, className, children, ...props }) => {
    const baseClasses = 'w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary';

    return (
        <select
            value={value}
            onChange={onChange}
            className={`${baseClasses} ${className || ''}`}
            {...props}
        >
            {children}
        </select>
    );
};

export default Select;