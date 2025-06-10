import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import Modal from '@/components/molecules/Modal';
import TaskService from '@/services/api/TaskService';

const TaskEditorForm = ({ isOpen, onClose, editingTask, onSaveSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dueDate: '',
        category: 'Personal'
    });
    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const categories = ['Personal', 'Team', 'Client'];

    useEffect(() => {
        if (editingTask) {
            setFormData({
                title: editingTask.title,
                description: editingTask.description || '',
                dueDate: editingTask.dueDate || '',
                category: editingTask.category
            });
        } else {
            setFormData({
                title: '',
                description: '',
                dueDate: '',
                category: 'Personal'
            });
        }
}, [editingTask]);

    const validateForm = () => {
        const errors = {};
        
        if (!formData.title || formData.title.trim().length === 0) {
            errors.title = 'Task title is required';
        } else if (formData.title.trim().length < 3) {
            errors.title = 'Task title must be at least 3 characters long';
        }
        
        if (formData.dueDate) {
            const selectedDate = new Date(formData.dueDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                errors.dueDate = 'Due date cannot be in the past';
            }
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error('Please fix the form errors');
            return;
        }

        setLoading(true);
        try {
            const taskData = {
                ...formData,
                title: formData.title.trim(),
                description: formData.description.trim()
            };

            if (editingTask) {
                const updatedTask = await TaskService.update(editingTask.id, taskData);
                toast.success('Task updated successfully');
                onSaveSuccess(updatedTask);
            } else {
                const newTask = await TaskService.create(taskData);
                toast.success('Task created successfully');
                onSaveSuccess(newTask);
            }
            onClose();
        } catch (err) {
            toast.error(err.message || 'Failed to save task');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Clear field error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <h3 className="font-heading text-lg font-semibold text-surface-900 mb-4">
                    {editingTask ? 'Edit Task' : 'Create New Task'}
                </h3>
                
<form onSubmit={handleSubmit} className="space-y-4">
                    <FormField
                        label="Title"
                        id="task-title"
                        name="title"
                        type="text"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        error={formErrors.title}
                        placeholder="Enter task title"
                    />
                    
                    <FormField
                        label="Description"
                        id="task-description"
                        name="description"
                        as="textarea"
                        value={formData.description}
                        onChange={handleChange}
                        error={formErrors.description}
                        placeholder="Add description (optional)"
                        rows="3"
                    />
                    
                    <FormField
                        label="Due Date"
                        id="task-dueDate"
                        name="dueDate"
                        type="date"
                        value={formData.dueDate}
                        onChange={handleChange}
                        error={formErrors.dueDate}
                    />
                    
                    <FormField
                        label="Category"
                        id="task-category"
                        name="category"
                        as="select"
                        value={formData.category}
                        onChange={handleChange}
                        error={formErrors.category}
                    >
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </FormField>
                    
                    <div className="flex space-x-3 pt-4">
                        <Button 
                            type="button" 
                            onClick={onClose} 
                            variant="outline" 
                            className="flex-1"
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            variant="primary" 
                            className="flex-1"
                            disabled={loading}
                            loading={loading}
                        >
                            {loading 
                                ? (editingTask ? 'Updating...' : 'Creating...')
                                : (editingTask ? 'Update Task' : 'Create Task')
                            }
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default TaskEditorForm;