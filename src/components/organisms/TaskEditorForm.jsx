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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingTask) {
                const updatedTask = await TaskService.update(editingTask.id, formData);
                toast.success('Task updated successfully');
                onSaveSuccess(updatedTask);
            } else {
                const newTask = await TaskService.create(formData);
                toast.success('Task created successfully');
                onSaveSuccess(newTask);
            }
            onClose();
        } catch (err) {
            toast.error('Failed to save task');
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
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="Enter task title"
                    />
                    
                    <FormField
                        label="Description"
                        id="task-description"
                        as="textarea"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Add description (optional)"
                        rows="3"
                    />
                    
                    <FormField
                        label="Due Date"
                        id="task-dueDate"
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    />
                    
                    <FormField
                        label="Category"
                        id="task-category"
                        as="select"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </FormField>
                    
                    <div className="flex space-x-3 pt-4">
                        <Button type="button" onClick={onClose} variant="outline" className="flex-1">
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" className="flex-1">
                            {editingTask ? 'Update Task' : 'Create Task'}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default TaskEditorForm;