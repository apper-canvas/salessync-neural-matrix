import taskData from '../mockData/tasks.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let tasks = [...taskData];

const TaskService = {
  async getAll() {
    await delay(300);
    return [...tasks];
  },

  async getById(id) {
    await delay(200);
    const task = tasks.find(t => t.id === id);
    if (!task) {
      throw new Error('Task not found');
    }
    return { ...task };
  },

async create(taskData) {
    await delay(300);
    
    // Validation
    if (!taskData.title || taskData.title.trim().length === 0) {
      throw new Error('Task title is required');
    }
    
    if (taskData.title.trim().length < 3) {
      throw new Error('Task title must be at least 3 characters long');
    }
    
    if (taskData.dueDate) {
      const selectedDate = new Date(taskData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        throw new Error('Due date cannot be in the past');
      }
    }
    
    const newTask = {
      ...taskData,
      id: Date.now().toString(),
      completed: false,
      createdAt: new Date().toISOString(),
      title: taskData.title.trim(),
      description: taskData.description ? taskData.description.trim() : ''
    };
    tasks.push(newTask);
    return { ...newTask };
  },

async update(id, updates) {
    await delay(250);
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    // Validation for updates
    if (updates.title !== undefined) {
      if (!updates.title || updates.title.trim().length === 0) {
        throw new Error('Task title is required');
      }
      
      if (updates.title.trim().length < 3) {
        throw new Error('Task title must be at least 3 characters long');
      }
      
      updates.title = updates.title.trim();
    }
    
    if (updates.description !== undefined) {
      updates.description = updates.description ? updates.description.trim() : '';
    }
    
    if (updates.dueDate) {
      const selectedDate = new Date(updates.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        throw new Error('Due date cannot be in the past');
      }
    }
    
    tasks[index] = { 
      ...tasks[index], 
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return { ...tasks[index] };
  },

  async delete(id) {
    await delay(200);
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    tasks.splice(index, 1);
    return true;
  }
};

export default TaskService;