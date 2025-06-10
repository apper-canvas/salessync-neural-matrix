import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const Button = ({ 
    children, 
    onClick = undefined,
    className = '', 
    variant = 'primary', 
    icon: Icon = null, 
    loading = false,
    disabled = false,
    type = 'button',
    ...props 
}) => {
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

    // Add loading state styling
    if (loading) {
        baseClasses += ' opacity-80 cursor-not-allowed';
    }

    // Filter out non-DOM props to prevent React warnings
    const { 
        loading: _loading, 
        variant: _variant, 
        icon: _icon, 
        ...domProps 
    } = props;

// Combine disabled state from both loading and disabled props
    const isDisabled = disabled || loading;

    return (
        <motion.button
            type={type}
            whileHover={{ scale: isDisabled ? 1 : 1.05 }}
            whileTap={{ scale: isDisabled ? 1 : 0.95 }}
            onClick={isDisabled ? undefined : onClick}
            className={`${baseClasses} ${className}`}
            disabled={isDisabled}
            aria-label={loading ? 'Loading...' : undefined}
            {...domProps}
        >
            {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
            )}
            {Icon && !loading && <Icon />}
            <span>{children}</span>
        </motion.button>
    );
};

Button.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    className: PropTypes.string,
    variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'text', 'danger', 'ghost']),
    icon: PropTypes.elementType,
    loading: PropTypes.bool,
    disabled: PropTypes.bool,
    type: PropTypes.oneOf(['button', 'submit', 'reset'])
};


export default Button;