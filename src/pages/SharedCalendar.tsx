
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CalendarView } from '@/components/CalendarView';
import { PhotoGallery } from '@/components/PhotoGallery';
import { Button } from '@/components/ui/button';
import { Eye, ArrowLeft } from 'lucide-react';
import { Photo, PhotosByDate } from '@/pages/Index';

const SharedCalendar = () => {
  const { calendarId } = useParams();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [photos, setPhotos] = useState<PhotosByDate>({});
  const [calendarOwner, setCalendarOwner] = useState('지우');
  const [permission, setPermission] = useState<'view' | 'edit'>('view');

  // 실제로는 API에서 공유된 캘린더 데이터를 가져와야 함
  useEffect(() => {
    // 프로토타입용 샘플 데이터
    const samplePhotos: PhotosByDate = {
      '2025-01-15': [
        {
          id: 'shared-1',
          url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
          date: '2025-01-15',
          title: '서울 재즈 페스티벌',
          note: '정말 멋진 공연이었어요!'
        }
      ]
    };
    setPhotos(samplePhotos);
    console.log('Loading shared calendar:', calendarId);
  }, [calendarId]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={handleGoBack}
                variant="ghost"
                size="sm"
                className="hover:bg-orange-100"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                뒤로가기
              </Button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
                  {calendarOwner}님의 Mo:ment
                </h1>
                <p className="text-sm text-orange-600/70 mt-1 flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  공유된 캘린더 ({permission === 'view' ? '보기 전용' : '편집 가능'})
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <CalendarView 
              photos={photos}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
            />
          </div>

          {/* Photo Gallery Section */}
          <div className="lg:col-span-1">
            <PhotoGallery 
              selectedDate={selectedDate}
              photos={selectedDate ? photos[selectedDate] || [] : []}
              onUpdatePhoto={() => {
                // 보기 전용이므로 편집 불가
                if (permission === 'view') {
                  alert('이 캘린더는 보기 전용입니다.');
                  return;
                }
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default SharedCalendar;
