import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';

const icon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function ResizeHandler() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 100);
  }, [map]);
  return null;
}

export default function SheltersMap({ shelters }) {
  const withCoords = shelters.filter(s => s.latitude && s.longitude);
  if (!withCoords.length) return null;

  return (
    <div className="map-wrap">
      <MapContainer center={[53.5, -7.7]} zoom={6} style={{ height: 400, width: '100%' }}>
        <ResizeHandler />
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