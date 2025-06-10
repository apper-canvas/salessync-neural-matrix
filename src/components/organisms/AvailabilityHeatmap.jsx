import React from 'react';
import { motion } from 'framer-motion';
import Input from '@/components/atoms/Input';
import Card from '@/components/molecules/Card';

const AvailabilityHeatmap = ({ teamMembers, selectedDate, setSelectedDate, timeSlots, getAvailabilityColor, getAvailabilityText }) => {
    return (
        <Card className="p-6">
            <h2 className="font-heading text-lg font-semibold text-surface-900 mb-4">
                Team Availability for {new Date(selectedDate).toLocaleDateString()}
            </h2>

            <div className="mb-6">
                <label className="block text-sm font-medium text-surface-700 mb-2">
                    Select Date for Availability
                </label>
                <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                />
            </div>

            <div className="overflow-x-auto">
                <div className="min-w-full">
                    <div className="grid grid-cols-10 gap-2 mb-2">
                        <div className="font-medium text-sm text-surface-600">Member</div>
                        {timeSlots.map(time => (
                            <div key={time} className="text-center text-sm font-medium text-surface-600">
                                {time}
                            </div>
                        ))}
                    </div>

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
        </Card>
    );
};

export default AvailabilityHeatmap;