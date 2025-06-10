import React, { useState, useEffect } from 'react';
import { format, isToday, parseISO } from 'date-fns';
import { toast } from 'react-toastify';
import LoadingState from '@/components/molecules/LoadingState';
import ErrorState from '@/components/molecules/ErrorState';
import TodaysAgenda from '@/components/organisms/TodaysAgenda';
import QuickAddFeature from '@/components/organisms/QuickAddFeature';
import TaskService from '@/services/api/TaskService';
import MeetingService from '@/services/api/MeetingService';

const TodayPage = () => {
  const [tasks, setTasks] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadTodayData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [allTasks, allMeetings] = await Promise.all([
        TaskService.getAll(),
        MeetingService.getAll()
      ]);
      
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

  useEffect(() => {
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
      <LoadingState>
        <div className="h-8 bg-surface-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="h-4 bg-surface-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-surface-100 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </LoadingState>
    );
  }

  if (error) {
    return (
      <ErrorState message={error} onRetry={() => window.location.reload()} />
    );
  }

  const combinedItems = [
    ...tasks.map(task => ({ ...task, type: 'task', time: task.dueDate })),
    ...meetings.map(meeting => ({ ...meeting, type: 'meeting', time: meeting.time }))
  ].sort((a, b) => {
    if (a.time && b.time) {
      return a.time.localeCompare(b.time);
    }
    return a.type === 'meeting' ? -1 : 1; // Prioritize meetings without specific time
  });

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-surface-900 mb-2">Today</h1>
        <p className="text-surface-600">{format(new Date(), 'EEEE, MMMM d')}</p>
      </div>

      <TodaysAgenda combinedItems={combinedItems} onCompleteTask={handleCompleteTask} />
      
      <QuickAddFeature />
    </div>
  );
};

export default TodayPage;