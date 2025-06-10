import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/molecules/Card';
import Button from '@/components/atoms/Button';
import Checkbox from '@/components/atoms/Checkbox';

const TaskListItem = ({ task, onComplete, onEdit, onDelete, index }) => {
    return (
        <Card animated={true} transition={{ delay: index * 0.05 }} className="hover:shadow-md transition-shadow p-4">
            <div className="flex items-start space-x-3">
                <Checkbox
                    checked={task.completed}
                    onChange={() => onComplete(task.id)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all mt-0.5
                        ${task.completed 
                          ? 'bg-success border-success animate-pulse-success' 
                          : 'border-surface-300 hover:border-primary'
                        }`}
                >
                    {task.completed && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="animate-check">
                            <ApperIcon name="Check" size={12} className="text-white" />
                        </motion.div>
                    )}
                </Checkbox>
                
                <div className="flex-1 min-w-0">
                    <h3 className={`font-medium break-words ${
                        task.completed ? 'line-through text-surface-500' : 'text-surface-900'
                    }`}>
                        {task.title}
                    </h3>
                    {task.description && (
                        <p className="text-sm text-surface-600 mt-1 break-words">{task.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                            ${task.category === 'Personal' ? 'bg-info/10 text-info' :
                                task.category === 'Team' ? 'bg-accent/10 text-accent' :
                                'bg-primary/10 text-primary'
                            }`}>
                            {task.category}
                        </span>
                        {task.dueDate && (
                            <span className="text-xs text-surface-500">
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                </div>
                
                <div className="flex items-center space-x-2">
                    <Button onClick={() => onEdit(task)} variant="ghost" icon={<ApperIcon name="Edit" size={16} />} />
                    <Button onClick={() => onDelete(task.id)} variant="ghost" icon={<ApperIcon name="Trash2" size={16} />} />
                </div>
            </div>
        </Card>
    );
};

export default TaskListItem;