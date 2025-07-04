import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Photo } from '@/pages/Index';
import { Camera } from 'lucide-react';
import React from 'react';

interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddPhoto: (photo: Photo) => void;
  selectedDate?: string | null;
}

export const UploadModal = ({ open, onOpenChange, onAddPhoto, selectedDate }: UploadModalProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(selectedDate || new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [uploading, setUploading] = useState(false);

  React.useEffect(() => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  }, [selectedDate]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files).slice(0, 10) : [];
    setSelectedFiles(files);
  };

  const handleSubmit = async () => {
    if (!selectedFiles.length) return;
    setUploading(true);
    try {
      const photos = selectedFiles.slice(0, 10).map((file, idx) => ({
        id: `${Date.now()}-${idx}`,
        url: URL.createObjectURL(file),
        date,
        title: title.trim() || undefined,
        note: note.trim() || undefined,
      }));
      photos.forEach(photo => onAddPhoto(photo));
      // Reset form
      setSelectedFiles([]);
      setTitle('');
      setDate(selectedDate || new Date().toISOString().split('T')[0]);
      setNote('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error uploading photo:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white border-orange-100">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Camera className="h-5 w-5 text-orange-500" />
            새로운 추억 추가
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* File Upload */}
          <div>
            <Label className="text-sm font-medium text-gray-700">사진 선택 (최대 10장)</Label>
            <div className="mt-1">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
              />
            </div>
            
            {selectedFiles.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {selectedFiles.map((file, idx) => (
                  <img
                    key={idx}
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${idx + 1}`}
                    className="w-full aspect-video object-cover rounded-lg border border-orange-200"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-sm font-medium text-gray-700">
              제목 (선택)
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 서울재즈페스티벌"
              className="mt-1 border-orange-200 focus:border-orange-400"
            />
          </div>

          {/* Date */}
          <div>
            <Label htmlFor="date" className="text-sm font-medium text-gray-700">
              날짜
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 border-orange-200 focus:border-orange-400"
            />
          </div>

          {/* Note */}
          <div>
            <Label htmlFor="note" className="text-sm font-medium text-gray-700">
              감상 메모 (선택)
            </Label>
            <Input
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="이날의 특별한 순간을 기록해보세요..."
              className="mt-1 border-orange-200 focus:border-orange-400"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSubmit}
              disabled={!selectedFiles.length || uploading}
              className="flex-1 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white"
            >
              {uploading ? '추가 중...' : '추억 저장'}
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-orange-200 hover:bg-orange-50"
            >
              취소
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
