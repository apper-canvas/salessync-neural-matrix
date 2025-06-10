import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import TaskService from '../services/api/TaskService';
import MeetingService from '../services/api/MeetingService';

const MainFeature = () => {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [activeTab, setActiveTab] = useState('task');
  const [taskData, setTaskData] = useState({ title: '', category: 'Personal' });
  const [meetingData, setMeetingData] = useState({ title: '', date: '', time: '' });

  const handleQuickAddTask = async (e) => {
    e.preventDefault();
    if (!taskData.title.trim()) return;

    try {
      await TaskService.create({
        ...taskData,
        description: '',
        dueDate: new Date().toISOString().split('T')[0],
        completed: false
      });
      
      toast.success('Task added successfully!');
      setTaskData({ title: '', category: 'Personal' });
      setShowQuickAdd(false);
    } catch (err) {
      toast.error('Failed to add task');
    }
  };

  const handleQuickAddMeeting = async (e) => {
    e.preventDefault();
    if (!meetingData.title.trim() || !meetingData.date || !meetingData.time) return;

    try {
      await MeetingService.create({
        ...meetingData,
        duration: 30,
        participants: [],
        notes: '',
        createdBy: 'current-user'
      });
      
      toast.success('Meeting scheduled successfully!');
      setMeetingData({ title: '', date: '', time: '' });
      setShowQuickAdd(false);
    } catch (err) {
      toast.error('Failed to schedule meeting');
    }
  };

  return (
    <>
      {/* Quick Add Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowQuickAdd(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-accent to-warning text-white rounded-full shadow-lg flex items-center justify-center z-30 hover:shadow-xl transition-shadow"
      >
        <ApperIcon name="Plus" size={24} />
      </motion.button>

      {/* Quick Add Modal */}
      <AnimatePresence>
        {showQuickAdd && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowQuickAdd(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed bottom-24 right-6 bg-white rounded-lg shadow-xl p-4 z-50 w-80 max-w-[calc(100vw-3rem)]"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-lg font-semibold text-surface-900">Quick Add</h3>
                <button
                  onClick={() => setShowQuickAdd(false)}
                  className="p-1 rounded-lg text-surface-500 hover:bg-surface-100 transition-colors"
                >
                  <ApperIcon name="X" size={16} />
                </button>
              </div>

              {/* Tab Selector */}
              <div className="flex space-x-1 mb-4 bg-surface-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('task')}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all
                    ${activeTab === 'task' 
                      ? 'bg-white text-primary shadow-sm' 
                      : 'text-surface-600 hover:text-surface-900'
                    }`}
                >
                  <ApperIcon name="CheckSquare" size={16} className="inline mr-2" />
                  Task
                </button>
                <button
                  onClick={() => setActiveTab('meeting')}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all
                    ${activeTab === 'meeting' 
                      ? 'bg-white text-primary shadow-sm' 
                      : 'text-surface-600 hover:text-surface-900'
                    }`}
                >
                  <ApperIcon name="Video" size={16} className="inline mr-2" />
                  Meeting
                </button>
              </div>

              {/* Quick Add Task Form */}
              {activeTab === 'task' && (
                <form onSubmit={handleQuickAddTask} className="space-y-3">
                  <input
                    type="text"
                    placeholder="What needs to be done?"
                    value={taskData.title}
                    onChange={(e) => setTaskData({...taskData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    autoFocus
                  />
                  <select
                    value={taskData.category}
                    onChange={(e) => setTaskData({...taskData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="Personal">Personal</option>
                    <option value="Team">Team</option>
                    <option value="Client">Client</option>
                  </select>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={!taskData.title.trim()}
                    className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Task
                  </motion.button>
                </form>
              )}

              {/* Quick Add Meeting Form */}
              {activeTab === 'meeting' && (
                <form onSubmit={handleQuickAddMeeting} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Meeting title"
                    value={meetingData.title}
                    onChange={(e) => setMeetingData({...meetingData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    autoFocus
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={meetingData.date}
                      onChange={(e) => setMeetingData({...meetingData, date: e.target.value})}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                    <input
                      type="time"
                      value={meetingData.time}
                      onChange={(e) => setMeetingData({...meetingData, time: e.target.value})}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={!meetingData.title.trim() || !meetingData.date || !meetingData.time}
                    className="w-full bg-accent text-white px-4 py-2 rounded-lg hover:bg-warning transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Schedule Meeting
                  </motion.button>
                </form>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MainFeature;