import { useState } from 'react';
import axios from 'axios';

const DOG_API = 'https://api.thedogapi.com/v1/breeds';
const CAT_API = 'https://api.thecatapi.com/v1/breeds';

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
      const url = species === 'Dog' ? DOG_API : CAT_API;
      const res = await axios.get(url);
      setBreeds(res.data.slice(0, 30));
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
        {loading ? 'Loading…' : `🔍 Get ${species} breeds`}
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