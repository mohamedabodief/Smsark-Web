import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function LocationMarker({ location, setLocation }) {
  useMapEvents({
    click(e) {
      console.log('[DEBUG] نقر على الخريطة:', e.latlng);
      setLocation(e.latlng);
    },
  });

  return location ? <Marker position={location} /> : null;
}

export default function MapDisplay({ location, setLocation }) {
  console.log('[DEBUG] MapDisplay location:', location);
  return (
    <MapContainer
      center={location}
      zoom={13}
      style={{ height: '70vh', width: '100%' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker location={location} setLocation={setLocation} />
    </MapContainer>
  );
}