import React, { useState, useCallback } from 'react';
import WorldMap from './components/WorldMap';
import ConfigSidebar from './components/ConfigSidebar';
import DataTable from './components/DataTable';
import { MapConfig, CountryData } from './types';

const initialMapConfig: MapConfig = {
  outlineColor: '#00ff00',
  selectedCountries: ['USA'],
  zoomToFit: 'USA',
};

const initialCountryData: CountryData[] = [
  { id: 1, stateProvince: 'California', country: 'USA', totalUsers: 1000000 },
  { id: 2, stateProvince: 'New York', country: 'USA', totalUsers: 800000 },
  { id: 3, stateProvince: 'Ontario', country: 'Canada', totalUsers: 500000 },
  { id: 4, stateProvince: 'England', country: 'United Kingdom', totalUsers: 2000000 },
];

function App() {
  const [mapConfig, setMapConfig] = useState<MapConfig>(initialMapConfig);
  const [countryData, setCountryData] = useState<CountryData[]>(initialCountryData);

  const handleConfigChange = useCallback((newConfig: Partial<MapConfig>) => {
    setMapConfig((prevConfig) => ({ ...prevConfig, ...newConfig }));
  }, []);

  const handleDataChange = useCallback((newData: CountryData[]) => {
    setCountryData(newData);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex mb-8">
        <div className="w-3/4 pr-4">
          <WorldMap config={mapConfig} data={countryData} />
        </div>
        <div className="w-1/4">
          <ConfigSidebar config={mapConfig} onConfigChange={handleConfigChange} />
        </div>
      </div>
      <div>
        <DataTable data={countryData} onDataChange={handleDataChange} />
      </div>
    </div>
  );
}

export default App;