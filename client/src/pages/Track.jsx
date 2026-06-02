import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Track() {
  const [email, setEmail] = useState('');
  const [id, setId] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResults([]);
    if (!email && !id) {
      setError('Enter email or request ID');
      return;
    }
    setLoading(true);
    try {
      const query = id ? `id=${id}` : `email=${encodeURIComponent(email)}`;
      const res = await api.get(`/adoptions/track?${query}`);
      setResults(Array.isArray(res.data) ? res.data : [res.data]);
    } catch (err) {
      setError(err.response?.data?.error || 'No adoption request found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">🐾</div>
        <h1>Track Adoption</h1>
        <p className="auth-sub">Check your request status</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email used when applying"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="or-divider">— or —</div>
          <input
            type="text"
            placeholder="Request ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Checking…' : 'Check Status'}
          </button>
        </form>

        {results.length > 0 && (
          <div className="track-results">
            {results.map((r) => (
              <div key={r._id} className="track-item">
                <div className="track-head">
                  <span className="track-id">#{r._id.slice(-6)}</span>
                  <span className={`badge badge-${r.status.toLowerCase()}`}>{r.status}</span>
                </div>
                <div className="track-body">
                  🐾 {r.animal?.name || 'Animal'} · {r.animal?.species || ''}
                </div>
                <div className="track-foot">By {r.adopterName}</div>
              </div>
            ))}
          </div>
        )}

        <p className="auth-foot">
          <Link to="/">Back to login</Link>
        </p>
      </div>
    </div>
  );
}