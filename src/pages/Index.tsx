import { useState } from 'react';
import { CalendarView } from '@/components/CalendarView';
import { PhotoGallery } from '@/components/PhotoGallery';
import { UploadModal } from '@/components/UploadModal';
import { ShareModal } from '@/components/ShareModal';
import { Button } from '@/components/ui/button';
import { Camera, Share } from 'lucide-react';

export interface Photo {
  id: string;
  url: string;
  date: string;
  title?: string;
  note?: string;
  location?: string;
}

export interface PhotosByDate {
  [date: string]: Photo[];
}

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [photos, setPhotos] = useState<PhotosByDate>({});
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [calendarId] = useState('my-calendar-123'); // 실제로는 사용자별 고유 ID

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const handleAddPhoto = (photo: Photo) => {
    setPhotos(prev => ({
      ...prev,
      [photo.date]: [...(prev[photo.date] || []), photo]
    }));
  };

  const handleUpdatePhoto = (photoId: string, updates: Partial<Photo>) => {
    setPhotos(prev => {
      const newPhotos = { ...prev };
      Object.keys(newPhotos).forEach(date => {
        newPhotos[date] = newPhotos[date].map(photo => 
          photo.id === photoId ? { ...photo, ...updates } : photo
        );
      });
      return newPhotos;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
                Mo:ment
              </h1>
              <p className="text-sm text-orange-600/70 mt-1">당신의 소중한 순간들</p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={() => setShareModalOpen(true)}
                variant="outline"
                className="border-orange-200 hover:bg-orange-50 text-orange-600"
              >
                <Share className="mr-2 h-4 w-4" />
                공유
              </Button>
              <Button 
                onClick={() => setUploadModalOpen(true)}
                className="bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Camera className="mr-2 h-4 w-4" />
                사진 추가
              </Button>
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
              onUpdatePhoto={handleUpdatePhoto}
            />
          </div>
        </div>
      </main>

      <UploadModal 
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        onAddPhoto={handleAddPhoto}
      />

      <ShareModal 
        open={shareModalOpen}
        onOpenChange={setShareModalOpen}
        calendarId={calendarId}
      />
    </div>
  );
};

export default Index;
