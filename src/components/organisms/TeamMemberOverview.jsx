import React from 'react';
import TeamMemberCard from './TeamMemberCard';
import EmptyState from '@/components/molecules/EmptyState';

const TeamMemberOverview = ({ teamMembers, getAvailabilityColor, getAvailabilityText }) => {
    if (teamMembers.length === 0) {
        return (
            <EmptyState
                iconName="Users"
                title="No team members"
                message="Team member data will appear here when available."
            />
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {teamMembers.map((member, index) => (
                <TeamMemberCard
                    key={member.id}
                    member={member}
                    availabilityColor={getAvailabilityColor(member.availability?.status || 'unknown')}
                    availabilityText={getAvailabilityText(member.availability?.status || 'unknown')}
                    index={index}
                />
            ))}
        </div>
    );
};

export default TeamMemberOverview;