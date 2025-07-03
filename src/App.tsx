import React, { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SharedCalendar from "./pages/SharedCalendar";
import NotFound from "./pages/NotFound";
import Sidebar from './components/Sidebar';
import { CalendarView } from './components/CalendarView';
import { PhotoGallery } from './components/PhotoGallery';
import { UploadModal } from './components/UploadModal';
import { ShareModal } from './components/ShareModal';
import { Button } from './components/ui/button';
import { Camera, Share } from 'lucide-react';

const queryClient = new QueryClient();

// mock 데이터
const calendarData: Record<string, any> = {
  me: {
    '2025-07-01': [{ id: '1', url: '/public/placeholder.svg', title: '나의 사진1', note: '메모1' }],
    '2025-07-02': [],
    '2025-07-15': [
      { id: 'me-15-1', url: '/public/placeholder.svg', title: '주말 여행', note: '서울에서 즐거운 시간' },
      { id: 'me-15-2', url: '/public/placeholder.svg', title: '카페에서', note: '맛있는 커피와 함께' }
    ],
    '2025-07-20': [
      { id: 'me-20-1', url: '/public/placeholder.svg', title: '친구들과', note: '오랜만에 만난 친구들' }
    ]
  },
  friend1: {
    '2025-07-01': [
      { id: 'f1-1-1', url: '/public/placeholder.svg', title: '친구1 사진1', note: '친구1 메모' },
      { id: 'f1-1-2', url: '/public/placeholder.svg', title: '점심 식사', note: '맛있는 파스타' }
    ],
    '2025-07-03': [
      { id: 'f1-3-1', url: '/public/placeholder.svg', title: '운동 후', note: '헬스장에서 열심히' }
    ],
    '2025-07-10': [
      { id: 'f1-10-1', url: '/public/placeholder.svg', title: '영화 관람', note: '새로 나온 영화 봤어요' },
      { id: 'f1-10-2', url: '/public/placeholder.svg', title: '팝콘과 함께', note: '영화관 팝콘은 최고!' }
    ],
    '2025-07-18': [
      { id: 'f1-18-1', url: '/public/placeholder.svg', title: '공원 산책', note: '날씨가 좋아서 산책' }
    ],
    '2025-07-25': [
      { id: 'f1-25-1', url: '/public/placeholder.svg', title: '생일 파티', note: '친구들과 생일 축하' },
      { id: 'f1-25-2', url: '/public/placeholder.svg', title: '케이크', note: '맛있는 생일 케이크' },
      { id: 'f1-25-3', url: '/public/placeholder.svg', title: '선물들', note: '받은 선물들' }
    ]
  },
  friend2: {
    '2025-07-02': [
      { id: 'f2-2-1', url: '/public/placeholder.svg', title: '친구2 사진1', note: '친구2 메모' }
    ],
    '2025-07-05': [
      { id: 'f2-5-1', url: '/public/placeholder.svg', title: '도서관에서', note: '시험 공부 중' },
      { id: 'f2-5-2', url: '/public/placeholder.svg', title: '커피 한 잔', note: '공부할 때는 커피가 필수' }
    ],
    '2025-07-12': [
      { id: 'f2-12-1', url: '/public/placeholder.svg', title: '쇼핑', note: '새 옷 사러 쇼핑' }
    ],
    '2025-07-22': [
      { id: 'f2-22-1', url: '/public/placeholder.svg', title: '맛집 탐방', note: 'SNS에서 본 맛집' },
      { id: 'f2-22-2', url: '/public/placeholder.svg', title: '디저트', note: '후식으로 디저트' }
    ],
    '2025-07-28': [
      { id: 'f2-28-1', url: '/public/placeholder.svg', title: '운동', note: '요가 수업' },
      { id: 'f2-28-2', url: '/public/placeholder.svg', title: '스트레칭', note: '유연성 향상 중' }
    ]
  }
};

const photoData: Record<string, any[]> = {
  me: [
    { date: '2024-06-01', url: '/public/placeholder.svg', desc: '나의 사진1' },
  ],
  friend1: [
    { date: '2024-06-01', url: '/public/placeholder.svg', desc: '친구1 사진1' },
  ],
  friend2: [
    { date: '2024-06-02', url: '/public/placeholder.svg', desc: '친구2 사진1' },
  ],
};

const App = () => {
  const [selectedUserId, setSelectedUserId] = useState('me');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [calendarId] = useState('my-calendar-123');
  const [calendarDataState, setCalendarDataState] = useState(calendarData);

  // 선택된 날짜의 사진 배열
  const photos = selectedDate && calendarDataState[selectedUserId][selectedDate] ? calendarDataState[selectedUserId][selectedDate] : [];

  // 사진 추가
  const handleAddPhoto = (photo: any) => {
    setCalendarDataState(prev => ({
      ...prev,
      [selectedUserId]: {
        ...prev[selectedUserId],
        [photo.date]: [...(prev[selectedUserId][photo.date] || []), photo]
      }
    }));
  };

  // 사진 메모/제목 업데이트 mock
  const handleUpdatePhoto = (photoId: string, updates: Partial<any>) => {
    setCalendarDataState(prev => {
      const userPhotos = { ...prev[selectedUserId] };
      Object.keys(userPhotos).forEach(date => {
        userPhotos[date] = userPhotos[date].map((photo: any) =>
          photo.id === photoId ? { ...photo, ...updates } : photo
        );
      });
      return {
        ...prev,
        [selectedUserId]: userPhotos
      };
    });
  };

  // 사진 삭제
  const handleDeletePhoto = (photoId: string) => {
    setCalendarDataState(prev => {
      const userPhotos = { ...prev[selectedUserId] };
      Object.keys(userPhotos).forEach(date => {
        userPhotos[date] = userPhotos[date].filter((photo: any) => photo.id !== photoId);
      });
      return {
        ...prev,
        [selectedUserId]: userPhotos
      };
    });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <div style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
                {/* Header */}
                <header style={{ background: 'rgba(255,255,255,0.8)', borderBottom: '1px solid #fde68a', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h1 style={{ fontSize: 28, fontWeight: 700, background: 'linear-gradient(to right, #ea580c, #e11d48)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Mo:ment</h1>
                    <p style={{ fontSize: 14, color: '#ea580c', opacity: 0.7, marginTop: 4 }}>당신의 소중한 순간들</p>
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
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
                </header>
                {/* Main Content */}
                <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
                  <Sidebar selectedUserId={selectedUserId} onSelectUser={id => { setSelectedUserId(id); setSelectedDate(null); }} />
                  <main style={{ flex: 1, padding: 24, overflow: 'auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 24, height: '100%' }}>
                      <div>
                        <CalendarView
                          photos={calendarDataState[selectedUserId]}
                          selectedDate={selectedDate}
                          onDateSelect={setSelectedDate}
                        />
                      </div>
                      <div>
                        <PhotoGallery
                          selectedDate={selectedDate}
                          photos={photos}
                          onUpdatePhoto={handleUpdatePhoto}
                          onDeletePhoto={handleDeletePhoto}
                          isOwnCalendar={selectedUserId === 'me'}
                        />
                      </div>
                    </div>
                  </main>
                </div>
                <UploadModal 
                  open={uploadModalOpen}
                  onOpenChange={setUploadModalOpen}
                  onAddPhoto={handleAddPhoto}
                  selectedDate={selectedDate}
                />
                <ShareModal 
                  open={shareModalOpen}
                  onOpenChange={setShareModalOpen}
                  calendarId={calendarId}
                />
              </div>
            } />
            <Route path="/shared/:calendarId" element={<SharedCalendar />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
