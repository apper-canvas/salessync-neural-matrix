import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/molecules/Card';

const MeetingListItem = ({ meeting, onDelete, index }) => {
    return (
        <Card animated={true} transition={{ delay: index * 0.1 }} className="border p-3 hover:shadow-sm">
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
                <Button onClick={() => onDelete(meeting.id)} variant="ghost" icon={<ApperIcon name="Trash2" size={14} />} />
            </div>
        </Card>
    );
};

export default MeetingListItem;