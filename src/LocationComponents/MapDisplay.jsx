import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function LocationMarker({ location, setLocation }) {
    // بيتابع الاحداث على الخريطه لو اتغيرت بيغير location
  useMapEvents({
    click(e) {
      setLocation(e.latlng);
    },
  });

  return location ? <Marker position={location} /> : null;
}

export default function MapDisplay({ location, setLocation }) {
  return (
    <MapContainer
    sx={{ width: '100%', height: '100%' }}
      center={location}
      zoom={13}
      style={{ height: '70vh', width: '100vh' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker location={location} setLocation={setLocation} />
    </MapContainer>
  );
}