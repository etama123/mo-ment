
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Share, Copy, Users, Eye, Edit3, CheckCircle } from 'lucide-react';

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  calendarId: string;
}

interface SharedUser {
  id: string;
  email: string;
  permission: 'view' | 'edit';
  status: 'pending' | 'accepted';
}

export const ShareModal = ({ open, onOpenChange, calendarId }: ShareModalProps) => {
  const [shareEmail, setShareEmail] = useState('');
  const [sharePermission, setSharePermission] = useState<'view' | 'edit'>('view');
  const [shareLink, setShareLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [sharedUsers, setSharedUsers] = useState<SharedUser[]>([
    { id: '1', email: 'friend@example.com', permission: 'view', status: 'accepted' },
    { id: '2', email: 'family@example.com', permission: 'edit', status: 'pending' }
  ]);

  const generateShareLink = () => {
    const link = `${window.location.origin}/shared/${calendarId}`;
    setShareLink(link);
  };

  const copyToClipboard = async () => {
    if (shareLink) {
      await navigator.clipboard.writeText(shareLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  const handleShareWithUser = () => {
    if (shareEmail.trim()) {
      const newUser: SharedUser = {
        id: Date.now().toString(),
        email: shareEmail.trim(),
        permission: sharePermission,
        status: 'pending'
      };
      setSharedUsers(prev => [...prev, newUser]);
      setShareEmail('');
      console.log('Sharing calendar with:', shareEmail, 'permission:', sharePermission);
    }
  };

  const removeSharedUser = (userId: string) => {
    setSharedUsers(prev => prev.filter(user => user.id !== userId));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white border-orange-100">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Share className="h-5 w-5 text-orange-500" />
            캘린더 공유하기
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* 공유 링크 생성 */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">공유 링크</Label>
            <div className="flex gap-2">
              <Button
                onClick={generateShareLink}
                variant="outline"
                className="border-orange-200 hover:bg-orange-50"
              >
                링크 생성
              </Button>
              {shareLink && (
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  className="border-orange-200 hover:bg-orange-50"
                >
                  {linkCopied ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                      복사됨
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      복사
                    </>
                  )}
                </Button>
              )}
            </div>
            {shareLink && (
              <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-sm text-gray-600 break-all">{shareLink}</p>
              </div>
            )}
          </div>

          {/* 사용자 초대 */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">사용자 초대</Label>
            <div className="flex gap-2">
              <Input
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
                placeholder="이메일 주소 입력"
                className="flex-1 border-orange-200 focus:border-orange-400"
              />
              <select
                value={sharePermission}
                onChange={(e) => setSharePermission(e.target.value as 'view' | 'edit')}
                className="px-3 py-2 border border-orange-200 rounded-md text-sm"
              >
                <option value="view">보기</option>
                <option value="edit">편집</option>
              </select>
              <Button
                onClick={handleShareWithUser}
                disabled={!shareEmail.trim()}
                className="bg-orange-500 hover:bg-orange-600"
              >
                초대
              </Button>
            </div>
          </div>

          {/* 공유된 사용자 목록 */}
          {sharedUsers.length > 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Users className="h-4 w-4" />
                공유된 사용자 ({sharedUsers.length})
              </Label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {sharedUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{user.email}</span>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          {user.permission === 'view' ? (
                            <Eye className="h-3 w-3" />
                          ) : (
                            <Edit3 className="h-3 w-3" />
                          )}
                          <span>{user.permission === 'view' ? '보기' : '편집'}</span>
                          <span>•</span>
                          <span className={user.status === 'accepted' ? 'text-green-600' : 'text-yellow-600'}>
                            {user.status === 'accepted' ? '수락됨' : '대기중'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => removeSharedUser(user.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:bg-red-50"
                    >
                      제거
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 액션 버튼 */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => onOpenChange(false)}
              className="flex-1 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white"
            >
              완료
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
