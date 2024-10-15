export interface MapConfig {
  outlineColor: string;
  selectedCountries: string[];
  zoomToFit: string;
}

export interface CountryData {
  id: number;
  stateProvince: string;
  country: string;
  totalUsers: number;
}