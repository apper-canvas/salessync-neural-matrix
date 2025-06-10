import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className, animated = false, initial = { opacity: 0, y: 20 }, animate = { opacity: 1, y: 0 }, transition, ...props }) => {
    const baseClasses = 'bg-white rounded-lg p-4 shadow-sm border border-surface-200';
    const combinedClasses = `${baseClasses} ${className || ''}`;

    if (animated) {
        return (
            <motion.div
                initial={initial}
                animate={animate}
                transition={transition}
                className={combinedClasses}
                {...props}
            >
                {children}
            </motion.div>
        );
    }

    return (
        <div className={combinedClasses} {...props}>
            {children}
        </div>
    );
};

export default Card;