import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';

export default function AnimalsView() {
  const { isAdmin } = useAuth();
  const [animals, setAnimals] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showAdopt, setShowAdopt] = useState(null);

  const [form, setForm] = useState({
    name: '', species: 'Dog', breed: '', age: '', gender: 'Male',
    status: 'Available', image: '', notes: '', shelter: ''
  });

  const [adoptForm, setAdoptForm] = useState({
    adopterName: '', adopterEmail: '', adopterPhone: '', notes: ''
  });

  useEffect(() => {
    load();
    api.get('/shelters').then(r => setShelters(r.data)).catch(() => {});
  }, []);

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

  async function handleAdd(e) {
    e.preventDefault();
    try {
      const data = { ...form };
      if (!data.shelter) delete data.shelter;
      if (!data.age) delete data.age;
      await api.post('/animals', data);
      setShowAdd(false);
      setForm({ name: '', species: 'Dog', breed: '', age: '', gender: 'Male', status: 'Available', image: '', notes: '', shelter: '' });
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add animal');
    }
  }

  async function handleAdopt(e) {
    e.preventDefault();
    try {
      const res = await api.post('/adoptions', {
        animal: showAdopt._id,
        ...adoptForm
      });
      alert(`Request submitted! Track ID: ${res.data._id.slice(-6)}`);
      setShowAdopt(null);
      setAdoptForm({ adopterName: '', adopterEmail: '', adopterPhone: '', notes: '' });
    } catch (err) {
      alert(err.response?.data?.error || 'Request failed');
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
        {isAdmin && (
          <button className="btn-primary btn-lg" onClick={() => setShowAdd(true)}>+ Add Animal</button>
        )}
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
                  <button className="btn-primary" onClick={() => setShowAdopt(a)}>❤️ Adopt</button>
                )}
                {isAdmin && (
                  <button className="btn-danger" onClick={() => handleDelete(a._id)}>🗑️</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── ADD ANIMAL MODAL ── */}
      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>Add Animal</h2>
              <button className="modal-close" onClick={() => setShowAdd(false)}>×</button>
            </div>
            <form onSubmit={handleAdd} className="modal-form">
              <div className="form-row">
                <label>Name *<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
                <label>Species *
                  <select value={form.species} onChange={(e) => setForm({ ...form, species: e.target.value })}>
                    <option>Dog</option><option>Cat</option><option>Bird</option><option>Rabbit</option><option>Other</option>
                  </select>
                </label>
              </div>
              <div className="form-row">
                <label>Breed<input value={form.breed} onChange={(e) => setForm({ ...form, breed: e.target.value })} /></label>
                <label>Age (years)<input type="number" min="0" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} /></label>
              </div>
              <div className="form-row">
                <label>Gender
                  <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                    <option>Male</option><option>Female</option><option>Unknown</option>
                  </select>
                </label>
                <label>Status
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option>Available</option><option>Medical Hold</option><option>Pending</option><option>Adopted</option>
                  </select>
                </label>
              </div>
              <label>Shelter
                <select value={form.shelter} onChange={(e) => setForm({ ...form, shelter: e.target.value })}>
                  <option value="">— None —</option>
                  {shelters.map(s => <option key={s._id} value={s._id}>{s.name} — {s.location}</option>)}
                </select>
              </label>
              <label>Image URL<input type="url" placeholder="https://..." value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} /></label>
              <label>Notes<textarea rows="3" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></label>
              <div className="modal-actions">
                <button type="button" className="btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Animal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── ADOPT MODAL ── */}
      {showAdopt && (
        <div className="modal-overlay" onClick={() => setShowAdopt(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>Adopt {showAdopt.name}</h2>
              <button className="modal-close" onClick={() => setShowAdopt(null)}>×</button>
            </div>
            <form onSubmit={handleAdopt} className="modal-form">
              <label>Your Name *<input required value={adoptForm.adopterName} onChange={(e) => setAdoptForm({ ...adoptForm, adopterName: e.target.value })} /></label>
              <label>Email<input type="email" value={adoptForm.adopterEmail} onChange={(e) => setAdoptForm({ ...adoptForm, adopterEmail: e.target.value })} /></label>
              <label>Phone<input type="tel" value={adoptForm.adopterPhone} onChange={(e) => setAdoptForm({ ...adoptForm, adopterPhone: e.target.value })} /></label>
              <label>Why do you want to adopt?<textarea rows="3" value={adoptForm.notes} onChange={(e) => setAdoptForm({ ...adoptForm, notes: e.target.value })} /></label>
              <div className="modal-actions">
                <button type="button" className="btn-ghost" onClick={() => setShowAdopt(null)}>Cancel</button>
                <button type="submit" className="btn-primary">❤️ Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}