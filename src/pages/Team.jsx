import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import TeamMemberService from '../services/api/TeamMemberService';

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await TeamMemberService.getAll();
      setTeamMembers(result);
    } catch (err) {
      setError(err.message || 'Failed to load team members');
      toast.error('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  const getAvailabilityColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-success';
      case 'busy':
        return 'bg-error';
      case 'tentative':
        return 'bg-warning';
      default:
        return 'bg-surface-300';
    }
  };

  const getAvailabilityText = (status) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'busy':
        return 'Busy';
      case 'tentative':
        return 'Tentative';
      default:
        return 'Unknown';
    }
  };

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  if (loading) {
    return (
      <div className="p-6 max-w-full overflow-hidden">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-surface-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="h-4 bg-surface-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-surface-100 rounded w-1/2"></div>
              </div>
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
          <h3 className="text-lg font-medium text-surface-900 mb-2">Failed to load team data</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <button
            onClick={loadTeamMembers}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (teamMembers.length === 0) {
    return (
      <div className="p-6 max-w-full overflow-hidden">
        <h1 className="font-heading text-2xl font-bold text-surface-900 mb-6">Team</h1>
        <div className="text-center py-12">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="Users" className="w-16 h-16 text-surface-300 mx-auto" />
          </motion.div>
          <h3 className="mt-4 text-lg font-medium text-surface-900">No team members</h3>
          <p className="mt-2 text-surface-500">Team member data will appear here when available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <h1 className="font-heading text-2xl font-bold text-surface-900 mb-6">Team</h1>

      {/* Date Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-surface-700 mb-2">
          Select Date for Availability
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {teamMembers.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-surface-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-surface-900 break-words">{member.name}</h3>
                <p className="text-sm text-surface-600 break-words">{member.email}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-surface-700">Today's Status</h4>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getAvailabilityColor(member.availability?.status || 'unknown')}`}></div>
                <span className="text-sm text-surface-600">
                  {getAvailabilityText(member.availability?.status || 'unknown')}
                </span>
              </div>
              {member.availability?.nextAvailable && (
                <p className="text-xs text-surface-500">
                  Next available: {member.availability.nextAvailable}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Availability Heatmap */}
      <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
        <h2 className="font-heading text-lg font-semibold text-surface-900 mb-4">
          Team Availability for {new Date(selectedDate).toLocaleDateString()}
        </h2>

        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Header */}
            <div className="grid grid-cols-10 gap-2 mb-2">
              <div className="font-medium text-sm text-surface-600">Member</div>
              {timeSlots.map(time => (
                <div key={time} className="text-center text-sm font-medium text-surface-600">
                  {time}
                </div>
              ))}
            </div>

            {/* Team Member Rows */}
            {teamMembers.map((member, memberIndex) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: memberIndex * 0.1 }}
                className="grid grid-cols-10 gap-2 mb-2 items-center"
              >
                <div className="text-sm font-medium text-surface-900 truncate pr-2">
                  {member.name.split(' ')[0]}
                </div>
                {timeSlots.map((time, timeIndex) => {
                  // Generate pseudo-random availability based on member and time
                  const seed = memberIndex * 100 + timeIndex;
                  const availability = ['available', 'busy', 'tentative'][seed % 3];
                  
                  return (
                    <motion.div
                      key={time}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: (memberIndex * 0.1) + (timeIndex * 0.02) }}
                      className={`w-8 h-8 rounded ${getAvailabilityColor(availability)} mx-auto cursor-pointer hover:scale-110 transition-transform`}
                      title={`${member.name} - ${time}: ${getAvailabilityText(availability)}`}
                    />
                  );
                })}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-6 mt-6 pt-4 border-t border-surface-200">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded"></div>
            <span className="text-sm text-surface-600">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning rounded"></div>
            <span className="text-sm text-surface-600">Tentative</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-error rounded"></div>
            <span className="text-sm text-surface-600">Busy</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;