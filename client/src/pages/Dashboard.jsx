import { useState } from 'react';
import { useAuth } from '../AuthContext';
import AnimalsView from '../components/AnimalsView';
import SheltersView from '../components/SheltersView';
import AdoptionsView from '../components/AdoptionsView';
import UsersView from '../components/UsersView';

export default function Dashboard() {
  const { user, logout, isAdmin } = useAuth();
  const [section, setSection] = useState('animals');

  const navItems = [
    { id: 'animals', label: '🐾 Animals' },
    { id: 'shelters', label: '🏠 Shelters' },
    { id: 'adoptions', label: '❤️ Adoptions' },
  ];
  if (isAdmin) navItems.push({ id: 'users', label: '👥 Users' });

  return (
    <div className="dash">
      <aside className="sidebar">
        <div className="brand">🐾 Paws Rescue</div>
        <nav>
          {navItems.map((n) => (
            <button
              key={n.id}
              className={section === n.id ? 'active' : ''}
              onClick={() => setSection(n.id)}
            >
              {n.label}
            </button>
          ))}
        </nav>
        <div className="user-box">
          <div className="user-avatar">{user?.name?.[0]?.toUpperCase() || '?'}</div>
          <div>
            <div className="user-name">{user?.name}</div>
            <div className="user-role">{user?.role}</div>
          </div>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </aside>

      <main className="main">
        {section === 'animals' && <AnimalsView />}
        {section === 'shelters' && <SheltersView />}
        {section === 'adoptions' && <AdoptionsView />}
        {section === 'users' && isAdmin && <UsersView />}
      </main>
    </div>
  );
}