import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const icon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function SheltersMap({ shelters }) {
  const withCoords = shelters.filter(s => s.latitude && s.longitude);
  if (!withCoords.length) return null;

  return (
    <div className="map-wrap">
      <MapContainer center={[53.5, -7.7]} zoom={6} style={{ height: 400, width: '100%', borderRadius: 12 }}>
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {withCoords.map(s => (
          <Marker key={s._id} position={[s.latitude, s.longitude]} icon={icon}>
            <Popup>
              <strong>{s.name}</strong><br />
              📍 {s.location}<br />
              🐾 {s.animalCount} animals
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}