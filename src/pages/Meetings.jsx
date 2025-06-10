import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import MeetingService from '../services/api/MeetingService';
import TeamMemberService from '../services/api/TeamMemberService';

const Meetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    duration: 30,
    participants: [],
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [meetingsData, teamData] = await Promise.all([
        MeetingService.getAll(),
        TeamMemberService.getAll()
      ]);
      setMeetings(meetingsData);
      setTeamMembers(teamData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load meetings data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newMeeting = await MeetingService.create({
        ...formData,
        createdBy: 'current-user'
      });
      setMeetings([...meetings, newMeeting]);
      toast.success('Meeting scheduled successfully');
      resetForm();
    } catch (err) {
      toast.error('Failed to schedule meeting');
    }
  };

  const handleDelete = async (meetingId) => {
    if (!window.confirm('Are you sure you want to cancel this meeting?')) return;
    
    try {
      await MeetingService.delete(meetingId);
      setMeetings(meetings.filter(m => m.id !== meetingId));
      toast.success('Meeting cancelled successfully');
    } catch (err) {
      toast.error('Failed to cancel meeting');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      date: '',
      time: '',
      duration: 30,
      participants: [],
      notes: ''
    });
    setShowForm(false);
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const getMeetingsForDate = (date) => {
    return meetings.filter(meeting => 
      meeting.date && isSameDay(parseISO(meeting.date), date)
    );
  };

  const selectedDateMeetings = selectedDate ? getMeetingsForDate(selectedDate) : [];

  if (loading) {
    return (
      <div className="p-6 max-w-full overflow-hidden">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-surface-200 rounded w-1/4"></div>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {[...Array(35)].map((_, i) => (
              <div key={i} className="h-20 bg-surface-200 rounded"></div>
            ))}
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
          <h3 className="text-lg font-medium text-surface-900 mb-2">Failed to load meetings</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-surface-900 mb-4 sm:mb-0">Meetings</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          data-action="schedule-meeting"
          className="bg-gradient-to-r from-accent to-warning text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:shadow-md transition-all"
        >
          <ApperIcon name="Plus" size={16} />
          <span>Schedule Meeting</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-lg font-semibold text-surface-900">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                  className="p-2 rounded-lg hover:bg-surface-100 transition-colors"
                >
                  <ApperIcon name="ChevronLeft" size={16} />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-3 py-2 text-sm bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
                >
                  Today
                </button>
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                  className="p-2 rounded-lg hover:bg-surface-100 transition-colors"
                >
                  <ApperIcon name="ChevronRight" size={16} />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-surface-600">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {monthDays.map(day => {
                const dayMeetings = getMeetingsForDate(day);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const isToday = isSameDay(day, new Date());
                
                return (
                  <motion.button
                    key={day.toISOString()}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedDate(day)}
                    className={`p-2 text-sm rounded-lg transition-all min-h-16 flex flex-col items-center justify-start
                      ${isSelected ? 'bg-primary text-white' :
                        isToday ? 'bg-accent/10 text-accent font-semibold' :
                        'hover:bg-surface-100'
                      }`}
                  >
                    <span>{format(day, 'd')}</span>
                    {dayMeetings.length > 0 && (
                      <div className="flex space-x-1 mt-1">
                        {dayMeetings.slice(0, 3).map((_, i) => (
                          <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full ${
                              isSelected ? 'bg-white' : 'bg-accent'
                            }`}
                          />
                        ))}
                        {dayMeetings.length > 3 && (
                          <span className={`text-xs ${isSelected ? 'text-white' : 'text-surface-600'}`}>
                            +{dayMeetings.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Day Meetings */}
        <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-4">
          <h3 className="font-heading text-lg font-semibold text-surface-900 mb-4">
            {selectedDate ? format(selectedDate, 'EEEE, MMM d') : 'Select a date'}
          </h3>

          {selectedDate && selectedDateMeetings.length === 0 && (
            <div className="text-center py-8">
              <ApperIcon name="Calendar" className="w-12 h-12 text-surface-300 mx-auto mb-2" />
              <p className="text-surface-500">No meetings scheduled</p>
            </div>
          )}

          {selectedDateMeetings.length > 0 && (
            <div className="space-y-3">
              {selectedDateMeetings.map((meeting, index) => (
                <motion.div
                  key={meeting.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-surface-200 rounded-lg p-3 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-surface-900 break-words">{meeting.title}</h4>
                      <p className="text-sm text-surface-600">
                        {meeting.time} • {meeting.duration} min
                      </p>
                      <p className="text-sm text-surface-500">
                        {meeting.participants?.length || 0} participants
                      </p>
                      {meeting.notes && (
                        <p className="text-sm text-surface-600 mt-2 break-words">{meeting.notes}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(meeting.id)}
                      className="p-1 rounded text-surface-500 hover:bg-error/10 hover:text-error transition-colors"
                    >
                      <ApperIcon name="Trash2" size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Meeting Form Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={resetForm}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-w-full max-h-[90vh] overflow-y-auto">
                <h3 className="font-heading text-lg font-semibold text-surface-900 mb-4">
                  Schedule New Meeting
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">
                      Meeting Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="Enter meeting title"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1">
                        Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1">
                        Time *
                      </label>
                      <input
                        type="time"
                        required
                        value={formData.time}
                        onChange={(e) => setFormData({...formData, time: e.target.value})}
                        className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">
                      Duration (minutes)
                    </label>
                    <select
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={45}>45 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={90}>1.5 hours</option>
                      <option value={120}>2 hours</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">
                      Participants
                    </label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {teamMembers.map(member => (
                        <label key={member.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.participants.includes(member.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({
                                  ...formData,
                                  participants: [...formData.participants, member.id]
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  participants: formData.participants.filter(id => id !== member.id)
                                });
                              }
                            }}
                            className="rounded border-surface-300 focus:ring-primary"
                          />
                          <span className="text-sm">{member.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      rows="3"
                      placeholder="Add agenda or notes"
                    />
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 px-4 py-2 border border-surface-300 text-surface-700 rounded-lg hover:bg-surface-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="flex-1 px-4 py-2 bg-accent text-white rounded-lg hover:bg-warning transition-colors"
                    >
                      Schedule Meeting
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Meetings;