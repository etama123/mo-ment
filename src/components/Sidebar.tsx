const users = [
  { id: 'me', name: '나의 캘린더', type: 'my' },
  { id: 'friend1', name: '친구1', type: 'friend' },
  { id: 'friend2', name: '친구2', type: 'friend' },
];

interface SidebarProps {
  selectedUserId: string;
  onSelectUser: (userId: string) => void;
}

const Sidebar = ({ selectedUserId, onSelectUser }: SidebarProps) => {
  const myCalendar = users.filter(user => user.type === 'my');
  const friendCalendars = users.filter(user => user.type === 'friend');

  return (
    <aside style={{ width: 200, borderRight: '1px solid #eee', padding: 16 }}>
      {/* 내 캘린더 섹션 */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 12, fontSize: 14, fontWeight: 600, color: '#374151' }}>내 캘린더</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {myCalendar.map((user) => (
            <li key={user.id}>
              <button
                style={{
                  background: user.id === selectedUserId ? '#e0e7ff' : 'transparent',
                  border: 'none',
                  padding: '8px 12px',
                  width: '100%',
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderRadius: 4,
                  marginBottom: 4,
                  fontWeight: user.id === selectedUserId ? 'bold' : 'normal',
                }}
                onClick={() => onSelectUser(user.id)}
              >
                {user.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* 친구 캘린더 섹션 */}
      <div>
        <h3 style={{ marginBottom: 12, fontSize: 14, fontWeight: 600, color: '#374151' }}>친구 캘린더</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {friendCalendars.map((user) => (
            <li key={user.id}>
              <button
                style={{
                  background: user.id === selectedUserId ? '#e0e7ff' : 'transparent',
                  border: 'none',
                  padding: '8px 12px',
                  width: '100%',
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderRadius: 4,
                  marginBottom: 4,
                  fontWeight: user.id === selectedUserId ? 'bold' : 'normal',
                }}
                onClick={() => onSelectUser(user.id)}
              >
                {user.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar; 