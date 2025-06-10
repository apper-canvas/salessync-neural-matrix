import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, onClick, className, variant = 'primary', icon: Icon, ...props }) => {
    let baseClasses = 'px-4 py-2 rounded-lg transition-all flex items-center justify-center space-x-2';
    
    switch (variant) {
        case 'primary':
            baseClasses += ' bg-primary text-white hover:bg-secondary';
            break;
        case 'secondary':
            baseClasses += ' bg-accent text-white hover:bg-warning';
            break;
        case 'outline':
            baseClasses += ' border border-surface-300 text-surface-700 hover:bg-surface-50';
            break;
        case 'text':
            baseClasses += ' text-surface-700 hover:bg-surface-100';
            break;
        case 'danger':
            baseClasses += ' bg-error text-white hover:bg-error-dark';
            break;
        case 'ghost':
            baseClasses += ' text-surface-500 hover:bg-surface-100 hover:text-primary';
            break;
        default:
            baseClasses += ' bg-primary text-white hover:bg-secondary';
    }

    return (
        <motion.button
            whileHover={{ scale: props.disabled ? 1 : 1.05 }}
            whileTap={{ scale: props.disabled ? 1 : 0.95 }}
            onClick={onClick}
            className={`${baseClasses} ${className || ''}`}
            {...props}
        >
            {Icon && Icon}
            <span>{children}</span>
        </motion.button>
    );
};

export default Button;