import React from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapConfig, CountryData } from '../types';
import worldCountries from '../data/world-countries.json';

interface WorldMapProps {
  config: MapConfig;
  data: CountryData[];
}

const WorldMap: React.FC<WorldMapProps> = ({ config, data }) => {
  const mapStyle = {
    height: '400px',
    width: '100%',
  };

  const onEachFeature = (feature: any, layer: any) => {
    if (feature.properties && feature.properties.name) {
      const countryName = feature.properties.name;
      const isSelected = config.selectedCountries.includes(countryName);
      const countryData = data.find((d) => d.country === countryName);

      layer.bindTooltip(`${countryName}${
        countryData ? `: ${countryData.totalUsers.toLocaleString()} users` : ''
      }`);

      layer.setStyle({
        fillColor: isSelected ? '#F4C430' : '#D6D6DA',
        weight: 1,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.7
      });

      if (isSelected) {
        layer.setStyle({
          color: config.outlineColor,
          weight: 2,
        });
      }

      layer.on({
        mouseover: (e: any) => {
          e.target.setStyle({
            fillColor: '#F53',
            fillOpacity: 0.7
          });
        },
        mouseout: (e: any) => {
          e.target.setStyle({
            fillColor: isSelected ? '#F4C430' : '#D6D6DA',
            fillOpacity: 0.7
          });
        }
      });
    }
  };

  return (
    <MapContainer center={[20, 0]} zoom={2} style={mapStyle}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <GeoJSON
        data={worldCountries}
        onEachFeature={onEachFeature}
      />
    </MapContainer>
  );
};

export default WorldMap;