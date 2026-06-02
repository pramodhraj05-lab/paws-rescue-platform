import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';

export default function AdoptionsView() {
  const { isAdmin } = useAuth();
  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await api.get('/adoptions');
      setAdoptions(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load adoptions');
    } finally {
      setLoading(false);
    }
  }

  async function handleStatus(id, status) {
    try {
      await api.put(`/adoptions/${id}`, { status });
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Update failed');
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this adoption record?')) return;
    try {
      await api.delete(`/adoptions/${id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Delete failed');
    }
  }

  if (loading) return <div className="loading">Loading adoptions…</div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Adoptions</h1>
          <p className="page-sub">Adoption requests &amp; status</p>
        </div>
      </div>

      <div className="grid">
        {adoptions.map((a) => (
          <div key={a._id} className="card">
            <div className="card-body">
              <div className="row-between">
                <div className="card-title">{a.adopterName}</div>
                <span className={`badge badge-${a.status.toLowerCase()}`}>{a.status}</span>
              </div>
              <div className="card-meta">
                🐾 {a.animal?.name || 'Animal'} · {a.animal?.species || ''}
              </div>
              {a.adopterEmail && <div className="row">📧 {a.adopterEmail}</div>}
              {a.adopterPhone && <div className="row">📞 {a.adopterPhone}</div>}
              {a.notes && <p className="card-notes">{a.notes}</p>}
              <div className="card-meta">ID: {a._id.slice(-6)} · {new Date(a.createdAt).toLocaleDateString()}</div>

              {isAdmin && (
                <div className="card-actions">
                  {a.status === 'Pending' && (
                    <>
                      <button className="btn-primary" onClick={() => handleStatus(a._id, 'Approved')}>✅ Approve</button>
                      <button className="btn-warning" onClick={() => handleStatus(a._id, 'Rejected')}>❌ Reject</button>
                    </>
                  )}
                  <button className="btn-danger" onClick={() => handleDelete(a._id)}>🗑️</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}