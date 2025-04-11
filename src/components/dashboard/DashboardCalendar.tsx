
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface DashboardCalendarProps {
  date: Date;
  setDate: (date: Date | undefined) => void;
}

const DashboardCalendar: React.FC<DashboardCalendarProps> = ({ date, setDate }) => {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar 
          mode="single"
          selected={date}
          onSelect={(date) => date && setDate(date)}
          className="mx-auto"
        />
      </CardContent>
    </Card>
  );
};

export default DashboardCalendar;
