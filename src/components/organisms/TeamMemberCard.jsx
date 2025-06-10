import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/molecules/Card';

const TeamMemberCard = ({ member, availabilityColor, availabilityText, index }) => {
    const memberInitials = member.name.split(' ').map(n => n[0]).join('').toUpperCase();

    return (
        <Card animated={true} transition={{ delay: index * 0.1 }} className="p-6 hover:shadow-md">
            <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">{memberInitials}</span>
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-surface-900 break-words">{member.name}</h3>
                    <p className="text-sm text-surface-600 break-words">{member.email}</p>
                </div>
            </div>

            <div className="space-y-2">
                <h4 className="text-sm font-medium text-surface-700">Today's Status</h4>
                <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${availabilityColor}`}></div>
                    <span className="text-sm text-surface-600">{availabilityText}</span>
                </div>
                {member.availability?.nextAvailable && (
                    <p className="text-xs text-surface-500">
                        Next available: {member.availability.nextAvailable}
                    </p>
                )}
            </div>
        </Card>
    );
};

export default TeamMemberCard;