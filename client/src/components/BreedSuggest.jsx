import { useState } from 'react';
import axios from 'axios';

export default function BreedSuggest({ species, onSelect }) {
  const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  async function fetchBreeds() {
    if (species !== 'Dog' && species !== 'Cat') {
      setError('Suggestions only for Dog or Cat');
      return;
    }
    setLoading(true);
    setError('');
    try {
      let list = [];
      if (species === 'Dog') {
        // Dog CEO API — free, no API key required
        const res = await axios.get('https://dog.ceo/api/breeds/list/all');
        list = Object.keys(res.data.message)
          .slice(0, 30)
          .map((name, idx) => ({
            id: idx,
            name: name.charAt(0).toUpperCase() + name.slice(1),
          }));
      } else {
        // Cat API
        const res = await axios.get('https://api.thecatapi.com/v1/breeds');
        list = res.data.slice(0, 30).map((b) => ({ id: b.id, name: b.name }));
      }
      setBreeds(list);
      setOpen(true);
    } catch (err) {
      setError('Failed to fetch breeds');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="breed-suggest">
      <button type="button" className="btn-ghost btn-sm" onClick={fetchBreeds} disabled={loading}>
        {loading ? 'Loading...' : `🔍 Get ${species} breeds`}
      </button>
      {error && <div className="breed-err">{error}</div>}
      {open && breeds.length > 0 && (
        <div className="breed-list">
          {breeds.map((b) => (
            <button
              key={b.id}
              type="button"
              className="breed-chip"
              onClick={() => { onSelect(b.name); setOpen(false); }}
            >
              {b.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}