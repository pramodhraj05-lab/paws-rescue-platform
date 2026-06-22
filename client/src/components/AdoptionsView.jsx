import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';

export default function AdoptionsView() {
  const { isAdmin } = useAuth();

  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    load();
  }, []);

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

  async function updateStatus(id, status) {
    try {
      await api.put(`/adoptions/${id}`, { status });
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update status');
    }
  }

  async function deleteAdoption(id) {
    if (!window.confirm('Delete this adoption request?')) return;

    try {
      await api.delete(`/adoptions/${id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Delete failed');
    }
  }

  if (loading) return <div className="loading">Loading adoptions…</div>;
  if (error) return <div className="error-state">{error}</div>;

  const stats = {
    total: adoptions.length,
    pending: adoptions.filter(a => a.status === 'Pending').length,
    approved: adoptions.filter(a => a.status === 'Approved').length,
    rejected: adoptions.filter(a => a.status === 'Rejected').length,
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Adoption Requests</h1>
          <p className="page-sub">
            Manage and review adoption applications
          </p>
        </div>
      </div>

      <div className="stats">
        <div className="stat">
          <div className="stat-num">{stats.total}</div>
          <div className="stat-lbl">Total</div>
        </div>

        <div className="stat">
          <div className="stat-num">{stats.pending}</div>
          <div className="stat-lbl">Pending</div>
        </div>

        <div className="stat">
          <div className="stat-num">{stats.approved}</div>
          <div className="stat-lbl">Approved</div>
        </div>

        <div className="stat">
          <div className="stat-num">{stats.rejected}</div>
          <div className="stat-lbl">Rejected</div>
        </div>
      </div>

      {adoptions.length === 0 ? (
        <div className="empty-state">
          No adoption requests found.
        </div>
      ) : (
        <div className="grid">
          {adoptions.map((a) => (
            <div key={a._id} className="card">
              {a.animal?.image ? (
                <img
                  src={a.animal.image}
                  alt={a.animal.name}
                  className="card-img"
                />
              ) : (
                <div className="card-img-placeholder">🐾</div>
              )}

              <div className="card-body">
                <div className="card-title">
                  {a.animal?.name || 'Unknown Animal'}
                </div>

                <div className="card-meta">
                  {a.animal?.species}
                </div>

                <span
                  className={`badge badge-${a.status.toLowerCase()}`}
                >
                  {a.status}
                </span>

                <p>
                  <strong>Applicant:</strong><br />
                  {a.adopterName}
                </p>

                {a.adopterEmail && (
                  <p>
                    <strong>Email:</strong><br />
                    {a.adopterEmail}
                  </p>
                )}

                {a.adopterPhone && (
                  <p>
                    <strong>Phone:</strong><br />
                    {a.adopterPhone}
                  </p>
                )}

                {a.notes && (
                  <p>
                    <strong>Notes:</strong><br />
                    {a.notes}
                  </p>
                )}

                <p className="card-meta">
                  Submitted:{' '}
                  {new Date(a.createdAt).toLocaleDateString()}
                </p>

                {isAdmin && (
                  <div className="card-actions">
                    {a.status === 'Pending' && (
                      <>
                        <button
                          className="btn-primary"
                          onClick={() =>
                            updateStatus(a._id, 'Approved')
                          }
                        >
                          ✅ Approve
                        </button>

                        <button
                          className="btn-danger"
                          onClick={() =>
                            updateStatus(a._id, 'Rejected')
                          }
                        >
                          ❌ Reject
                        </button>
                      </>
                    )}

                    <button
                      className="btn-danger"
                      onClick={() => deleteAdoption(a._id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}