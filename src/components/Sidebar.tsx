import { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface Calendar {
  id: string;
  name: string;
  type: 'my' | 'friend';
}

interface SidebarProps {
  selectedUserId: string;
  onSelectUser: (userId: string) => void;
  calendars: Calendar[];
  onAddCalendar: (name: string) => void;
  onUpdateCalendar: (id: string, name: string) => void;
  onDeleteCalendar: (id: string) => void;
}

const Sidebar = ({ 
  selectedUserId, 
  onSelectUser, 
  calendars,
  onAddCalendar,
  onUpdateCalendar,
  onDeleteCalendar
}: SidebarProps) => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCalendar, setEditingCalendar] = useState<Calendar | null>(null);
  const [newCalendarName, setNewCalendarName] = useState('');
  const [editCalendarName, setEditCalendarName] = useState('');

  const myCalendars = calendars.filter(calendar => calendar.type === 'my');
  const friendCalendars = calendars.filter(calendar => calendar.type === 'friend');

  const handleAddCalendar = () => {
    if (newCalendarName.trim()) {
      onAddCalendar(newCalendarName.trim());
      setNewCalendarName('');
      setAddModalOpen(false);
    }
  };

  const handleEditCalendar = () => {
    if (editingCalendar && editCalendarName.trim()) {
      onUpdateCalendar(editingCalendar.id, editCalendarName.trim());
      setEditCalendarName('');
      setEditingCalendar(null);
      setEditModalOpen(false);
    }
  };

  const handleDeleteCalendar = (calendar: Calendar) => {
    if (window.confirm(`"${calendar.name}" 캘린더를 삭제하시겠습니까?`)) {
      onDeleteCalendar(calendar.id);
    }
  };

  return (
    <aside style={{ width: 200, borderRight: '1px solid #eee', padding: 16 }}>
      {/* 내 캘린더 섹션 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>내 캘린더</h3>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setAddModalOpen(true)}
            style={{ padding: '4px 8px', minWidth: 'auto' }}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {myCalendars.map((calendar) => (
            <li key={calendar.id} style={{ marginBottom: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <button
                  style={{
                    background: calendar.id === selectedUserId ? '#e0e7ff' : 'transparent',
                    border: 'none',
                    padding: '8px 12px',
                    flex: 1,
                    textAlign: 'left',
                    cursor: 'pointer',
                    borderRadius: 4,
                    fontWeight: calendar.id === selectedUserId ? 'bold' : 'normal',
                  }}
                  onClick={() => onSelectUser(calendar.id)}
                >
                  {calendar.name}
                </button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setEditingCalendar(calendar);
                    setEditCalendarName(calendar.name);
                    setEditModalOpen(true);
                  }}
                  style={{ padding: '4px', minWidth: 'auto' }}
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteCalendar(calendar)}
                  style={{ padding: '4px', minWidth: 'auto', color: '#ef4444' }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* 친구 캘린더 섹션 */}
      <div>
        <h3 style={{ marginBottom: 12, fontSize: 14, fontWeight: 600, color: '#374151' }}>친구 캘린더</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {friendCalendars.map((calendar) => (
            <li key={calendar.id}>
              <button
                style={{
                  background: calendar.id === selectedUserId ? '#e0e7ff' : 'transparent',
                  border: 'none',
                  padding: '8px 12px',
                  width: '100%',
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderRadius: 4,
                  marginBottom: 4,
                  fontWeight: calendar.id === selectedUserId ? 'bold' : 'normal',
                }}
                onClick={() => onSelectUser(calendar.id)}
              >
                {calendar.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* 캘린더 추가 모달 */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>새 캘린더 만들기</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">캘린더 이름</label>
              <Input
                value={newCalendarName}
                onChange={(e) => setNewCalendarName(e.target.value)}
                placeholder="예: 가족 여행, 일상 기록"
                onKeyPress={(e) => e.key === 'Enter' && handleAddCalendar()}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddCalendar} disabled={!newCalendarName.trim()}>
                만들기
              </Button>
              <Button variant="outline" onClick={() => setAddModalOpen(false)}>
                취소
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 캘린더 편집 모달 */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>캘린더 이름 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">캘린더 이름</label>
              <Input
                value={editCalendarName}
                onChange={(e) => setEditCalendarName(e.target.value)}
                placeholder="캘린더 이름을 입력하세요"
                onKeyPress={(e) => e.key === 'Enter' && handleEditCalendar()}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleEditCalendar} disabled={!editCalendarName.trim()}>
                수정
              </Button>
              <Button variant="outline" onClick={() => setEditModalOpen(false)}>
                취소
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </aside>
  );
};

export default Sidebar; 