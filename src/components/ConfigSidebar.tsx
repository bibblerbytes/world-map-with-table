import React from 'react';
import { MapConfig } from '../types';

interface ConfigSidebarProps {
  config: MapConfig;
  onConfigChange: (newConfig: Partial<MapConfig>) => void;
}

const ConfigSidebar: React.FC<ConfigSidebarProps> = ({ config, onConfigChange }) => {
  const handleOutlineColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onConfigChange({ outlineColor: e.target.value });
  };

  const handleZoomToFitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onConfigChange({ zoomToFit: e.target.value });
  };

  const handleCountrySelect = (country: string) => {
    const newSelectedCountries = config.selectedCountries.includes(country)
      ? config.selectedCountries.filter((c) => c !== country)
      : [...config.selectedCountries, country];
    onConfigChange({ selectedCountries: newSelectedCountries });
  };

  const handleSelectAll = () => {
    onConfigChange({ selectedCountries: ['USA', 'Canada', 'United Kingdom', 'France', 'Germany', 'Japan'] });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Map Configuration</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Outline Color</label>
        <input
          type="color"
          value={config.outlineColor}
          onChange={handleOutlineColorChange}
          className="mt-1 block w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Zoom to Fit</label>
        <select
          value={config.zoomToFit}
          onChange={handleZoomToFitChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">None</option>
          <option value="USA">USA</option>
          <option value="Canada">Canada</option>
          <option value="United Kingdom">United Kingdom</option>
          <option value="France">France</option>
          <option value="Germany">Germany</option>
          <option value="Japan">Japan</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Selected Countries</label>
        <button
          onClick={handleSelectAll}
          className="mb-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Select All
        </button>
        {['USA', 'Canada', 'United Kingdom', 'France', 'Germany', 'Japan'].map((country) => (
          <div key={country} className="flex items-center">
            <input
              type="checkbox"
              id={country}
              checked={config.selectedCountries.includes(country)}
              onChange={() => handleCountrySelect(country)}
              className="mr-2"
            />
            <label htmlFor={country}>{country}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConfigSidebar;