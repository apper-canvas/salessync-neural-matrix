import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, isToday, parseISO } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import MainFeature from '../components/MainFeature';
import TaskService from '../services/api/TaskService';
import MeetingService from '../services/api/MeetingService';

const Today = () => {
  const [tasks, setTasks] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTodayData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [allTasks, allMeetings] = await Promise.all([
          TaskService.getAll(),
          MeetingService.getAll()
        ]);
        
        // Filter for today's items
        const todayTasks = allTasks.filter(task => 
          task.dueDate && isToday(parseISO(task.dueDate))
        );
        
        const todayMeetings = allMeetings.filter(meeting => 
          meeting.date && isToday(parseISO(meeting.date))
        );
        
        setTasks(todayTasks);
        setMeetings(todayMeetings);
      } catch (err) {
        setError(err.message || 'Failed to load today\'s data');
        toast.error('Failed to load today\'s data');
      } finally {
        setLoading(false);
      }
    };
    
    loadTodayData();
  }, []);

  const handleCompleteTask = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      const updatedTask = await TaskService.update(taskId, { 
        ...task, 
        completed: !task.completed 
      });
      
      setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
      toast.success(updatedTask.completed ? 'Task completed!' : 'Task reopened');
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-full overflow-hidden">
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-surface-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="h-4 bg-surface-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-surface-100 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-full overflow-hidden">
        <div className="text-center py-12">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">Failed to load today's data</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const todayFormatted = format(new Date(), 'EEEE, MMMM d');
  const combinedItems = [
    ...tasks.map(task => ({ ...task, type: 'task', time: task.dueDate })),
    ...meetings.map(meeting => ({ ...meeting, type: 'meeting', time: meeting.time }))
  ].sort((a, b) => {
    if (a.time && b.time) {
      return a.time.localeCompare(b.time);
    }
    return a.type === 'meeting' ? -1 : 1;
  });

  if (combinedItems.length === 0) {
    return (
      <div className="p-6 max-w-full overflow-hidden">
        <div className="mb-6">
          <h1 className="font-heading text-2xl font-bold text-surface-900 mb-2">Today</h1>
          <p className="text-surface-600">{todayFormatted}</p>
        </div>
        
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
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-surface-900 mb-2">Today</h1>
        <p className="text-surface-600">{todayFormatted}</p>
      </div>

      <div className="space-y-4">
        {combinedItems.map((item, index) => (
          <motion.div
            key={`${item.type}-${item.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg p-4 shadow-sm border border-surface-200 hover:shadow-md transition-shadow"
          >
            {item.type === 'task' ? (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleCompleteTask(item.id)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all
                    ${item.completed 
                      ? 'bg-success border-success' 
                      : 'border-surface-300 hover:border-primary'
                    }`}
                >
                  {item.completed && (
                    <ApperIcon name="Check" size={12} className="text-white" />
                  )}
                </button>
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
          </motion.div>
        ))}
      </div>

      <MainFeature />
    </div>
  );
};

export default Today;