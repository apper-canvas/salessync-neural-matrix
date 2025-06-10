import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import LoadingState from '@/components/molecules/LoadingState';
import ErrorState from '@/components/molecules/ErrorState';
import PageHeader from '@/components/organisms/PageHeader';
import TeamMemberOverview from '@/components/organisms/TeamMemberOverview';
import AvailabilityHeatmap from '@/components/organisms/AvailabilityHeatmap';
import QuickAddFeature from '@/components/organisms/QuickAddFeature';
import TeamMemberService from '@/services/api/TeamMemberService';

const TeamPage = () => {
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
      <LoadingState>
        <div className="h-8 bg-surface-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
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
      <ErrorState message={error} onRetry={loadTeamMembers} />
    );
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <PageHeader title="Team" />

      <TeamMemberOverview
        teamMembers={teamMembers}
        getAvailabilityColor={getAvailabilityColor}
        getAvailabilityText={getAvailabilityText}
      />

      <AvailabilityHeatmap
        teamMembers={teamMembers}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        timeSlots={timeSlots}
        getAvailabilityColor={getAvailabilityColor}
        getAvailabilityText={getAvailabilityText}
      />
      
      <QuickAddFeature />
    </div>
  );
};

export default TeamPage;