import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';

export default function AnimalsView() {
  const { isAdmin } = useAuth();
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await api.get('/animals');
      setAnimals(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load animals');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this animal?')) return;
    try {
      await api.delete(`/animals/${id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Delete failed');
    }
  }

  async function handleAdopt(animal) {
    const name = prompt('Your name for adoption:');
    if (!name) return;
    try {
      const res = await api.post('/adoptions', { animal: animal._id, adopterName: name });
      alert(`Request submitted! Track ID: ${res.data._id}`);
    } catch (err) {
      alert(err.response?.data?.error || 'Request failed');
    }
  }

  if (loading) return <div className="loading">Loading animals…</div>;
  if (error) return <div className="error-state">{error}</div>;

  const stats = {
    total: animals.length,
    available: animals.filter((a) => a.status === 'Available').length,
    adopted: animals.filter((a) => a.status === 'Adopted').length,
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Animals</h1>
          <p className="page-sub">All animals in the shelter system</p>
        </div>
      </div>

      <div className="stats">
        <div className="stat"><div className="stat-num">{stats.total}</div><div className="stat-lbl">Total</div></div>
        <div className="stat"><div className="stat-num">{stats.available}</div><div className="stat-lbl">Available</div></div>
        <div className="stat"><div className="stat-num">{stats.adopted}</div><div className="stat-lbl">Adopted</div></div>
      </div>

      <div className="grid">
        {animals.map((a) => (
          <div key={a._id} className="card">
            {a.image ? (
              <img src={a.image} alt={a.name} className="card-img" onError={(e) => e.target.style.display = 'none'} />
            ) : (
              <div className="card-img-placeholder">🐾</div>
            )}
            <div className="card-body">
              <div className="card-title">{a.name}</div>
              <div className="card-meta">
                {a.species} · {a.breed} · {a.age} yrs · {a.gender}
              </div>
              <span className={`badge badge-${a.status.toLowerCase().replace(' ', '-')}`}>{a.status}</span>
              {a.shelter && <div className="card-shelter">🏠 {a.shelter.name}</div>}
              {a.notes && <p className="card-notes">{a.notes}</p>}
              <div className="card-actions">
                {a.status !== 'Adopted' && (
                  <button className="btn-primary" onClick={() => handleAdopt(a)}>❤️ Adopt</button>
                )}
                {isAdmin && (
                  <button className="btn-danger" onClick={() => handleDelete(a._id)}>🗑️</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}