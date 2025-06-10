import React from 'react';

const Checkbox = ({ checked, onChange, className, ...props }) => {
    const baseClasses = 'rounded border-surface-300 focus:ring-primary';
    return (
        <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className={`${baseClasses} ${className || ''}`}
            {...props}
        />
    );
};

export default Checkbox;