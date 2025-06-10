import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Card from '@/components/molecules/Card';
import ApperIcon from '@/components/ApperIcon';
import Checkbox from '@/components/atoms/Checkbox';

const TodaysAgenda = ({ combinedItems, onCompleteTask }) => {
    const todayFormatted = format(new Date(), 'EEEE, MMMM d');

    if (combinedItems.length === 0) {
        return (
            <div className="text-center py-12">
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                >
                    <ApperIcon name="Calendar" className="w-16 h-16 text-surface-300 mx-auto" />
                </motion.div>
                <h3 className="mt-4 text-lg font-medium text-surface-900">All clear for today!</h3>
                <p className="mt-2 text-surface-500">You have no tasks or meetings scheduled for today.</p>
                <div className="mt-6 space-x-4">
                    {/* These buttons trigger actions external to this component,
                        can be passed via props or rely on global selectors */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
                        onClick={() => document.querySelector('[data-action="create-task"]')?.click()}
                    >
                        Add Task
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                        onClick={() => document.querySelector('[data-action="schedule-meeting"]')?.click()}
                    >
                        Schedule Meeting
                    </motion.button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {combinedItems.map((item, index) => (
                <Card
                    key={`${item.type}-${item.id}`}
                    animated={true}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 hover:shadow-md"
                >
                    {item.type === 'task' ? (
                        <div className="flex items-center space-x-3">
                            <Checkbox
                                checked={item.completed}
                                onChange={() => onCompleteTask(item.id)}
                                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all
                                    ${item.completed 
                                      ? 'bg-success border-success' 
                                      : 'border-surface-300 hover:border-primary'
                                    }`}
                            >
                                {item.completed && (
                                    <ApperIcon name="Check" size={12} className="text-white" />
                                )}
                            </Checkbox>
                            <div className="flex-1 min-w-0">
                                <h3 className={`font-medium break-words ${
                                    item.completed ? 'line-through text-surface-500' : 'text-surface-900'
                                }`}>
                                    {item.title}
                                </h3>
                                <p className="text-sm text-surface-600 break-words">{item.description}</p>
                                <div className="flex items-center space-x-2 mt-1">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                                        ${item.category === 'Personal' ? 'bg-info/10 text-info' :
                                            item.category === 'Team' ? 'bg-accent/10 text-accent' :
                                            'bg-primary/10 text-primary'
                                        }`}>
                                        {item.category}
                                    </span>
                                    {item.time && (
                                        <span className="text-xs text-surface-500">{item.time}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-3">
                            <div className="w-5 h-5 bg-accent rounded flex items-center justify-center">
                                <ApperIcon name="Video" size={12} className="text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-surface-900 break-words">{item.title}</h3>
                                <p className="text-sm text-surface-600 break-words">
                                    {item.time} • {item.duration} min • {item.participants?.length || 0} participants
                                </p>
                                {item.notes && (
                                    <p className="text-sm text-surface-500 mt-1 break-words">{item.notes}</p>
                                )}
                            </div>
                        </div>
                    )}
                </Card>
            ))}
        </div>
    );
};

export default TodaysAgenda;