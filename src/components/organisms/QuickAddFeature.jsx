import React, { useState } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Modal from '@/components/molecules/Modal';
import TabButton from '@/components/atoms/TabButton';
import TaskService from '@/services/api/TaskService';
import MeetingService from '@/services/api/MeetingService';

const QuickAddFeature = () => {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [activeTab, setActiveTab] = useState('task');
  const [taskData, setTaskData] = useState({ title: '', category: 'Personal' });
  const [meetingData, setMeetingData] = useState({ title: '', date: '', time: '' });

  const handleQuickAddTask = async (e) => {
    e.preventDefault();
    if (!taskData.title.trim()) {
        toast.error('Task title cannot be empty.');
        return;
    }

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
    if (!meetingData.title.trim() || !meetingData.date || !meetingData.time) {
        toast.error('Please fill all required meeting fields.');
        return;
    }

    try {
      await MeetingService.create({
        ...meetingData,
        duration: 30,
        participants: [],
        notes: '',
        createdBy: 'current-user' // Placeholder
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
      <Button
        onClick={() => setShowQuickAdd(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-30 hover:shadow-xl"
        variant="secondary"
        icon={<ApperIcon name="Plus" size={24} />}
      />

      <Modal isOpen={showQuickAdd} onClose={() => setShowQuickAdd(false)} className="bottom-24 right-6 items-end justify-end p-0">
        <div className="bg-white rounded-lg shadow-xl p-4 w-80 max-w-[calc(100vw-3rem)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-lg font-semibold text-surface-900">Quick Add</h3>
            <Button onClick={() => setShowQuickAdd(false)} variant="ghost" icon={<ApperIcon name="X" size={16} />} />
          </div>

          <div className="flex space-x-1 mb-4 bg-surface-100 rounded-lg p-1">
            <TabButton
              isActive={activeTab === 'task'}
              onClick={() => setActiveTab('task')}
              iconName="CheckSquare"
              label="Task"
            />
            <TabButton
              isActive={activeTab === 'meeting'}
              onClick={() => setActiveTab('meeting')}
              iconName="Video"
              label="Meeting"
            />
          </div>

          {activeTab === 'task' && (
            <form onSubmit={handleQuickAddTask} className="space-y-3">
              <Input
                type="text"
                placeholder="What needs to be done?"
                value={taskData.title}
                onChange={(e) => setTaskData({...taskData, title: e.target.value})}
                autoFocus
              />
              <Select
                value={taskData.category}
                onChange={(e) => setTaskData({...taskData, category: e.target.value})}
              >
                <option value="Personal">Personal</option>
                <option value="Team">Team</option>
                <option value="Client">Client</option>
              </Select>
              <Button
                type="submit"
                disabled={!taskData.title.trim()}
                className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
                variant="primary"
              >
                Add Task
              </Button>
            </form>
          )}

          {activeTab === 'meeting' && (
            <form onSubmit={handleQuickAddMeeting} className="space-y-3">
              <Input
                type="text"
                placeholder="Meeting title"
                value={meetingData.title}
                onChange={(e) => setMeetingData({...meetingData, title: e.target.value})}
                autoFocus
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="date"
                  value={meetingData.date}
                  onChange={(e) => setMeetingData({...meetingData, date: e.target.value})}
                />
                <Input
                  type="time"
                  value={meetingData.time}
                  onChange={(e) => setMeetingData({...meetingData, time: e.target.value})}
                />
              </div>
              <Button
                type="submit"
                disabled={!meetingData.title.trim() || !meetingData.date || !meetingData.time}
                className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
                variant="secondary"
              >
                Schedule Meeting
              </Button>
            </form>
          )}
        </div>
      </Modal>
    </>
  );
};

export default QuickAddFeature;