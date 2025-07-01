
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PhotosByDate } from '@/pages/Index';

interface CalendarViewProps {
  photos: PhotosByDate;
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
}

export const CalendarView = ({ photos, selectedDate, onDateSelect }: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];

  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const generateCalendarDays = () => {
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      const dateStr = current.toISOString().split('T')[0];
      const isCurrentMonth = current.getMonth() === month;
      const hasPhotos = photos[dateStr] && photos[dateStr].length > 0;
      const isSelected = selectedDate === dateStr;
      const isToday = current.toDateString() === new Date().toDateString();
      
      days.push({
        date: new Date(current),
        dateStr,
        day: current.getDate(),
        isCurrentMonth,
        hasPhotos,
        isSelected,
        isToday,
        photoCount: photos[dateStr]?.length || 0,
        thumbnail: hasPhotos ? photos[dateStr][0].url : null
      });
      
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <Card className="p-6 bg-white/90 backdrop-blur-sm border-orange-100 shadow-xl">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateMonth('prev')}
          className="hover:bg-orange-100"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <h2 className="text-2xl font-bold text-gray-800">
          {year}년 {monthNames[month]}
        </h2>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateMonth('next')}
          className="hover:bg-orange-100"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {weekDays.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, index) => (
          <button
            key={index}
            onClick={() => day.isCurrentMonth && onDateSelect(day.dateStr)}
            className={`
              aspect-square p-1 rounded-lg transition-all duration-300 relative overflow-hidden
              ${day.isCurrentMonth 
                ? 'hover:bg-orange-100 cursor-pointer' 
                : 'text-gray-300 cursor-not-allowed'
              }
              ${day.isSelected 
                ? 'ring-2 ring-orange-400 bg-orange-50' 
                : ''
              }
              ${day.isToday 
                ? 'bg-gradient-to-br from-orange-200 to-rose-200' 
                : ''
              }
            `}
            disabled={!day.isCurrentMonth}
          >
            {/* Thumbnail Background */}
            {day.thumbnail && (
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-30 rounded-lg"
                style={{ backgroundImage: `url(${day.thumbnail})` }}
              />
            )}
            
            {/* Day Number */}
            <div className={`
              relative z-10 text-sm font-medium h-full flex flex-col items-center justify-center
              ${day.hasPhotos ? 'text-white drop-shadow-md' : ''}
              ${!day.isCurrentMonth ? 'text-gray-300' : ''}
            `}>
              <span>{day.day}</span>
              {day.hasPhotos && (
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1 shadow-sm" />
              )}
            </div>
            
            {/* Photo Count Badge */}
            {day.photoCount > 1 && (
              <div className="absolute top-1 right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                {day.photoCount}
              </div>
            )}
          </button>
        ))}
      </div>
    </Card>
  );
};
