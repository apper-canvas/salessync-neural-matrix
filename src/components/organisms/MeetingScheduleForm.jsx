import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import Checkbox from '@/components/atoms/Checkbox';
import Modal from '@/components/molecules/Modal';
import MeetingService from '@/services/api/MeetingService';
import TeamMemberService from '@/services/api/TeamMemberService';

const MeetingScheduleForm = ({ isOpen, onClose, onSaveSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        time: '',
        duration: 30,
        participants: [],
        notes: ''
    });
    const [teamMembers, setTeamMembers] = useState([]);
    const [loadingMembers, setLoadingMembers] = useState(true);
    const [membersError, setMembersError] = useState(null);

    useEffect(() => {
        const fetchTeamMembers = async () => {
            setLoadingMembers(true);
            try {
                const data = await TeamMemberService.getAll();
                setTeamMembers(data);
            } catch (err) {
                setMembersError('Failed to load team members for participants.');
                toast.error('Failed to load team members.');
            } finally {
                setLoadingMembers(false);
            }
        };
        if (isOpen) {
            fetchTeamMembers();
            // Optionally pre-fill date if a date was selected in the calendar
            // if (initialDate) setFormData(prev => ({ ...prev, date: format(initialDate, 'yyyy-MM-dd') }));
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newMeeting = await MeetingService.create({
                ...formData,
                createdBy: 'current-user' // Placeholder
            });
            toast.success('Meeting scheduled successfully');
            onSaveSuccess(newMeeting);
            onClose();
        } catch (err) {
            toast.error('Failed to schedule meeting');
        }
    };

    const handleParticipantChange = (memberId, isChecked) => {
        setFormData(prev => ({
            ...prev,
            participants: isChecked
                ? [...prev.participants, memberId]
                : prev.participants.filter(id => id !== memberId)
        }));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                <h3 className="font-heading text-lg font-semibold text-surface-900 mb-4">
                    Schedule New Meeting
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <FormField
                        label="Meeting Title"
                        id="meeting-title"
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="Enter meeting title"
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            label="Date"
                            id="meeting-date"
                            type="date"
                            required
                            value={formData.date}
                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                        />
                        <FormField
                            label="Time"
                            id="meeting-time"
                            type="time"
                            required
                            value={formData.time}
                            onChange={(e) => setFormData({...formData, time: e.target.value})}
                        />
                    </div>
                    
                    <FormField
                        label="Duration (minutes)"
                        id="meeting-duration"
                        as="select"
                        value={formData.duration}
                        onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                    >
                        <option value={15}>15 minutes</option>
                        <option value={30}>30 minutes</option>
                        <option value={45}>45 minutes</option>
                        <option value={60}>1 hour</option>
                        <option value={90}>1.5 hours</option>
                        <option value={120}>2 hours</option>
                    </FormField>
                    
                    <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">
                            Participants
                        </label>
                        {loadingMembers && <p className="text-sm text-surface-500">Loading team members...</p>}
                        {membersError && <p className="text-sm text-error">{membersError}</p>}
                        {!loadingMembers && !membersError && (
                            <div className="space-y-2 max-h-32 overflow-y-auto border border-surface-200 rounded p-2">
                                {teamMembers.length === 0 ? (
                                    <p className="text-sm text-surface-500">No team members available.</p>
                                ) : (
                                    teamMembers.map(member => (
                                        <label key={member.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                checked={formData.participants.includes(member.id)}
                                                onChange={(e) => handleParticipantChange(member.id, e.target.checked)}
                                            />
                                            <span className="text-sm">{member.name}</span>
                                        </label>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                    
                    <FormField
                        label="Notes"
                        id="meeting-notes"
                        as="textarea"
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        rows="3"
                        placeholder="Add agenda or notes"
                    />
                    
                    <div className="flex space-x-3 pt-4">
                        <Button type="button" onClick={onClose} variant="outline" className="flex-1">
                            Cancel
                        </Button>
                        <Button type="submit" variant="secondary" className="flex-1">
                            Schedule Meeting
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default MeetingScheduleForm;