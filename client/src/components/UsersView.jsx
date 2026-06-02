import { useEffect, useState } from 'react';
import api from '../api';

export default function UsersView() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/auth/users')
      .then((res) => setUsers(res.data))
      .catch((err) => setError(err.response?.data?.error || 'Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading users…</div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Users</h1>
          <p className="page-sub">All registered accounts</p>
        </div>
      </div>

      <table className="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td><span className={`badge badge-${u.role}`}>{u.role}</span></td>
              <td>{new Date(u.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}