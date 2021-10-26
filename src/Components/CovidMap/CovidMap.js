import React from 'react';
import "./CovidMap.css";
import { MapContainer, TileLayer } from 'react-leaflet';
import { ShowDataOnMap } from '../utilies';


function CovidMap({ countries, casesType, center, zoom }) {
  return (
    <div className="map">
      <MapContainer
        key={center[0]}
        center={[center[0], center[1]]}
        zoom={zoom}
        scrollWheelZoom={true}
        animate
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {ShowDataOnMap(countries, casesType)}
      </MapContainer>
    </div>
  )
}

export default CovidMap;
