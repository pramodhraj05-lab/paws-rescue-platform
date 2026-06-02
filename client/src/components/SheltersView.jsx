import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';

export default function SheltersView() {
  const { isAdmin } = useAuth();
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await api.get('/shelters');
      setShelters(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load shelters');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this shelter?')) return;
    try {
      await api.delete(`/shelters/${id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Delete failed');
    }
  }

  if (loading) return <div className="loading">Loading shelters…</div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Shelters</h1>
          <p className="page-sub">All registered Paws Rescue shelters</p>
        </div>
      </div>

      <div className="grid">
        {shelters.map((s) => {
          const pct = s.capacity ? Math.min(100, Math.round((s.animalCount / s.capacity) * 100)) : 0;
          const barColor = pct >= 90 ? '#c0392b' : pct >= 70 ? '#e67e22' : '#4a7c59';
          return (
            <div key={s._id} className="card">
              <div className="shelter-head">
                <div className="shelter-emoji">🏠</div>
                <div>
                  <div className="card-title">{s.name}</div>
                  <div className="card-meta">📍 {s.location}</div>
                </div>
                <span className="badge badge-count">{s.animalCount} animals</span>
              </div>
              <div className="card-body">
                {s.phone && <div className="row">📞 {s.phone}</div>}
                {s.email && <div className="row">📧 {s.email}</div>}
                {s.capacity > 0 && (
                  <>
                    <div className="row">🏷️ Capacity: {s.animalCount} / {s.capacity}</div>
                    <div className="cap-bar"><div style={{ width: `${pct}%`, background: barColor }} /></div>
                    <div className="cap-pct">{pct}% occupied</div>
                  </>
                )}
                {isAdmin && (
                  <div className="card-actions">
                    <button className="btn-danger" onClick={() => handleDelete(s._id)}>🗑️ Delete</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}