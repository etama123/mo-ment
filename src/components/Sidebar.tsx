const users = [
  { id: 'me', name: '나의 캘린더' },
  { id: 'friend1', name: '친구1' },
  { id: 'friend2', name: '친구2' },
];

interface SidebarProps {
  selectedUserId: string;
  onSelectUser: (userId: string) => void;
}

const Sidebar = ({ selectedUserId, onSelectUser }: SidebarProps) => {
  return (
    <aside style={{ width: 200, borderRight: '1px solid #eee', padding: 16 }}>
      <h3 style={{ marginBottom: 16 }}>캘린더 보기</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {users.map((user) => (
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
    </aside>
  );
};

export default Sidebar; 