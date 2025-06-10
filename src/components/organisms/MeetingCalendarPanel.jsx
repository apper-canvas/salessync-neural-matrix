import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/molecules/Card';
import CalendarDayCell from '@/components/atoms/CalendarDayCell';

const MeetingCalendarPanel = ({ currentDate, setCurrentDate, selectedDate, setSelectedDate, meetings }) => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    // Calculate the first day of the week for the month's start, to fill preceding empty cells
    const startDayOfWeek = monthStart.getDay(); // 0 for Sunday, 1 for Monday, etc.
    const emptyCells = Array.from({ length: startDayOfWeek }, (_, i) => ({ type: 'empty', id: `empty-${i}` }));

    const getMeetingsForDate = (date) => {
        return meetings.filter(meeting => 
            meeting.date && isSameDay(new Date(meeting.date), date)
        );
    };

    return (
        <Card className="lg:col-span-2 p-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-lg font-semibold text-surface-900">
                    {format(currentDate, 'MMMM yyyy')}
                </h2>
                <div className="flex space-x-2">
                    <Button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))} variant="ghost" icon={<ApperIcon name="ChevronLeft" size={16} />} />
                    <Button onClick={() => setCurrentDate(new Date())} variant="primary" className="px-3 py-2 text-sm">
                        Today
                    </Button>
                    <Button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))} variant="ghost" icon={<ApperIcon name="ChevronRight" size={16} />} />
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-surface-600">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {emptyCells.map(cell => <div key={cell.id} className="p-2 min-h-16" />)}
                {monthDays.map(day => {
                    const dayMeetings = getMeetingsForDate(day);
                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                    const isToday = isSameDay(day, new Date());
                    
                    return (
                        <CalendarDayCell
                            key={day.toISOString()}
                            day={format(day, 'd')}
                            isSelected={isSelected}
                            isToday={isToday}
                            hasMeetings={dayMeetings.length}
                            onClick={() => setSelectedDate(day)}
                        />
                    );
                })}
            </div>
        </Card>
    );
};

export default MeetingCalendarPanel;