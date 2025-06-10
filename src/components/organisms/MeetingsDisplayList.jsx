import React from 'react';
import { format } from 'date-fns';
import Card from '@/components/molecules/Card';
import EmptyState from '@/components/molecules/EmptyState';
import MeetingListItem from './MeetingListItem';

const MeetingsDisplayList = ({ selectedDate, meetingsForSelectedDate, onDeleteMeeting }) => {
    return (
        <Card className="p-4">
            <h3 className="font-heading text-lg font-semibold text-surface-900 mb-4">
                {selectedDate ? format(selectedDate, 'EEEE, MMM d') : 'Select a date'}
            </h3>

            {selectedDate && meetingsForSelectedDate.length === 0 && (
                <EmptyState
                    iconName="Calendar"
                    title="No meetings scheduled"
                    message="Select another date or schedule a new meeting."
                />
            )}

            {meetingsForSelectedDate.length > 0 && (
                <div className="space-y-3">
                    {meetingsForSelectedDate.map((meeting, index) => (
                        <MeetingListItem
                            key={meeting.id}
                            meeting={meeting}
                            onDelete={onDeleteMeeting}
                            index={index}
                        />
                    ))}
                </div>
            )}
        </Card>
    );
};

export default MeetingsDisplayList;