import React from 'react';
import { motion } from 'framer-motion';

const CalendarDayCell = ({ day, isSelected, isToday, hasMeetings, onClick, children, ...props }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={onClick}
            className={`p-2 text-sm rounded-lg transition-all min-h-16 flex flex-col items-center justify-start
              ${isSelected ? 'bg-primary text-white' :
                isToday ? 'bg-accent/10 text-accent font-semibold' :
                'hover:bg-surface-100'
              } ${props.className || ''}`}
            {...props}
        >
            <span>{day}</span>
            {hasMeetings && (
                <div className="flex space-x-1 mt-1">
                    {Array.from({ length: Math.min(hasMeetings, 3) }).map((_, i) => (
                        <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full ${
                                isSelected ? 'bg-white' : 'bg-accent'
                            }`}
                        />
                    ))}
                    {hasMeetings > 3 && (
                        <span className={`text-xs ${isSelected ? 'text-white' : 'text-surface-600'}`}>
                            +{hasMeetings - 3}
                        </span>
                    )}
                </div>
            )}
            {children}
        </motion.button>
    );
};

export default CalendarDayCell;