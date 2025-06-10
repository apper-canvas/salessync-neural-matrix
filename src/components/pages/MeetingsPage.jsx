import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { isSameDay, parseISO } from 'date-fns';
import LoadingState from '@/components/molecules/LoadingState';
import ErrorState from '@/components/molecules/ErrorState';
import PageHeader from '@/components/organisms/PageHeader';
import MeetingCalendarPanel from '@/components/organisms/MeetingCalendarPanel';
import MeetingsDisplayList from '@/components/organisms/MeetingsDisplayList';
import MeetingScheduleForm from '@/components/organisms/MeetingScheduleForm';
import QuickAddFeature from '@/components/organisms/QuickAddFeature';
import MeetingService from '@/services/api/MeetingService';
import TeamMemberService from '@/services/api/TeamMemberService'; // Needed for MeetingScheduleForm

const MeetingsPage = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Only load meetings here. Team members are loaded within MeetingScheduleForm if needed.
      const meetingsData = await MeetingService.getAll();
      setMeetings(meetingsData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load meetings data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMeetingSaveSuccess = (newMeeting) => {
    setMeetings([...meetings, newMeeting]);
    // Optionally set selectedDate to the new meeting's date to show it immediately
    if (newMeeting.date) {
        setSelectedDate(parseISO(newMeeting.date));
    }
  };

  const handleDeleteMeeting = async (meetingId) => {
    if (!window.confirm('Are you sure you want to cancel this meeting?')) return;
    
    try {
      await MeetingService.delete(meetingId);
      setMeetings(meetings.filter(m => m.id !== meetingId));
      toast.success('Meeting cancelled successfully');
    } catch (err) {
      toast.error('Failed to cancel meeting');
    }
  };

  const getMeetingsForDate = (date) => {
    return meetings.filter(meeting => 
      meeting.date && isSameDay(parseISO(meeting.date), date)
    );
  };

  const meetingsForSelectedDate = selectedDate ? getMeetingsForDate(selectedDate) : [];

  if (loading) {
    return (
      <LoadingState>
        <div className="h-8 bg-surface-200 rounded w-1/4"></div>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {[...Array(35)].map((_, i) => (
            <div key={i} className="h-20 bg-surface-200 rounded"></div>
          ))}
        </div>
      </LoadingState>
    );
  }

  if (error) {
    return (
      <ErrorState message={error} onRetry={loadData} />
    );
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <PageHeader
        title="Meetings"
        onAddClick={() => setShowForm(true)}
        addButtonText="Schedule Meeting"
        addButtonIcon="Plus"
        data-action="schedule-meeting" // For quick add feature to target
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MeetingCalendarPanel
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          meetings={meetings}
        />
        <MeetingsDisplayList
          selectedDate={selectedDate}
          meetingsForSelectedDate={meetingsForSelectedDate}
          onDeleteMeeting={handleDeleteMeeting}
        />
      </div>

      <MeetingScheduleForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSaveSuccess={handleMeetingSaveSuccess}
      />
      
      <QuickAddFeature />
    </div>
  );
};

export default MeetingsPage;