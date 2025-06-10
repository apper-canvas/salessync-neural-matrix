import React from 'react';

const Textarea = ({ value, onChange, placeholder, className, rows = 3, ...props }) => {
    const baseClasses = 'w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary';

    return (
        <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            className={`${baseClasses} ${className || ''}`}
            {...props}
        />
    );
};

export default Textarea;