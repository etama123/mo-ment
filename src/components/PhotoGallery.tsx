import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Photo } from '@/pages/Index';
import { Trash2 } from 'lucide-react';

interface PhotoGalleryProps {
  selectedDate: string | null;
  photos: Photo[];
  onUpdatePhoto: (photoId: string, updates: Partial<Photo>) => void;
  onDeletePhoto: (photoId: string) => void;
  isOwnCalendar: boolean;
}

export const PhotoGallery = ({ selectedDate, photos, onUpdatePhoto, onDeletePhoto, isOwnCalendar }: PhotoGalleryProps) => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [editingNote, setEditingNote] = useState(false);
  const [noteText, setNoteText] = useState('');

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
    setNoteText(photo.note || '');
    setEditingNote(false);
  };

  const handleSaveNote = () => {
    if (selectedPhoto) {
      onUpdatePhoto(selectedPhoto.id, { note: noteText });
      setSelectedPhoto({ ...selectedPhoto, note: noteText });
      setEditingNote(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekDay = weekDays[date.getDay()];
    
    return `${year}년 ${parseInt(month)}월 ${parseInt(day)}일 ${weekDay}요일`;
  };

  if (!selectedDate) {
    return (
      <Card className="p-6 bg-white/90 backdrop-blur-sm border-orange-100 shadow-xl h-fit">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-200 to-rose-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-rose-400 rounded-full" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">날짜를 선택해주세요</h3>
          <p className="text-sm text-gray-500">캘린더에서 날짜를 클릭하면<br />그날의 추억을 볼 수 있어요</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white/90 backdrop-blur-sm border-orange-100 shadow-xl">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          {formatDate(selectedDate)}
        </h3>
        <p className="text-sm text-gray-600">
          {photos.length > 0 ? `${photos.length}장의 사진` : '사진이 없습니다'}
        </p>
      </div>

      {photos.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center">
            <div className="w-6 h-6 bg-gray-300 rounded" />
          </div>
          <p className="text-sm text-gray-500">이날의 사진을 추가해보세요</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Photo Grid */}
          <div className="grid grid-cols-2 gap-3">
            {photos.map((photo) => (
              <button
                key={photo.id}
                onClick={() => handlePhotoClick(photo)}
                className={`
                  aspect-square rounded-lg overflow-hidden transition-all duration-300
                  hover:scale-105 hover:shadow-lg
                  ${selectedPhoto?.id === photo.id 
                    ? 'ring-2 ring-orange-400' 
                    : 'hover:ring-2 hover:ring-orange-200'
                  }
                `}
              >
                <img
                  src={photo.url}
                  alt={photo.title || 'Photo'}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Selected Photo Details */}
          {selectedPhoto && (
            <div className="border-t border-orange-100 pt-4 mt-6">
              <div className="mb-4">
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.title || 'Selected photo'}
                  className="w-full aspect-video object-cover rounded-lg shadow-sm"
                />
              </div>
              
              <div className="space-y-3">
                {isOwnCalendar && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">제목</Label>
                    <Input
                      value={selectedPhoto.title || ''}
                      onChange={(e) => onUpdatePhoto(selectedPhoto.id, { title: e.target.value })}
                      placeholder="사진 제목을 입력하세요"
                      className="mt-1 border-orange-200 focus:border-orange-400"
                    />
                  </div>
                )}

                {isOwnCalendar && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">감상 메모</Label>
                    {editingNote ? (
                      <div className="mt-1 space-y-2">
                        <Input
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="이날의 감상을 기록해보세요..."
                          className="border-orange-200 focus:border-orange-400"
                        />
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={handleSaveNote}
                            className="bg-orange-500 hover:bg-orange-600"
                          >
                            저장
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => setEditingNote(false)}
                            className="border-orange-200 hover:bg-orange-50"
                          >
                            취소
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div 
                        onClick={() => setEditingNote(true)}
                        className="mt-1 p-3 border border-orange-200 rounded-md cursor-pointer hover:bg-orange-50 transition-colors"
                      >
                        {selectedPhoto.note || (
                          <span className="text-gray-500 text-sm">
                            클릭해서 감상을 기록해보세요...
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* 사진 정보 표시 (친구 캘린더일 때) */}
                {!isOwnCalendar && (
                  <div className="space-y-2">
                    {selectedPhoto.title && (
                      <div>
                        <Label className="text-sm font-medium text-gray-700">제목</Label>
                        <div className="mt-1 p-3 bg-gray-50 rounded-md text-gray-800">
                          {selectedPhoto.title}
                        </div>
                      </div>
                    )}
                    {selectedPhoto.note && (
                      <div>
                        <Label className="text-sm font-medium text-gray-700">감상 메모</Label>
                        <div className="mt-1 p-3 bg-gray-50 rounded-md text-gray-800">
                          {selectedPhoto.note}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Delete Button - 나의 캘린더일 때만 표시 */}
                {isOwnCalendar && (
                  <div className="pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        if (window.confirm('이 사진을 삭제하시겠습니까?')) {
                          onDeletePhoto(selectedPhoto.id);
                          setSelectedPhoto(null);
                        }
                      }}
                      className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      사진 삭제
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
