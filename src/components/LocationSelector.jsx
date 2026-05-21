import React, { useState, useEffect } from 'react';
import { Country, State, City } from 'country-state-city';

const LocationSelector = ({ country, state, city, setCountry, setState, setCity, inputClassName }) => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  useEffect(() => {
    if (country) {
      setStates(State.getStatesOfCountry(country));
    } else {
      setStates([]);
      setCities([]);
    }
  }, [country]);

  useEffect(() => {
    if (country && state) {
      setCities(City.getCitiesOfState(country, state));
    } else {
      setCities([]);
    }
  }, [country, state]);

  return (
    <>
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1 label-text">Country</label>
        <select 
          required 
          className={inputClassName || "w-full bg-glass border border-glass-border rounded-2xl px-6 py-4 text-text-primary outline-none focus:border-accent/50 transition-all portal-input"}
          value={country}
          onChange={(e) => {
            setCountry(e.target.value);
            setState('');
            setCity('');
          }}
        >
          <option value="" disabled className="bg-card-bg text-text-primary">Select Country</option>
          {countries.map(c => (
            <option key={c.isoCode} value={c.isoCode} className="bg-card-bg text-text-primary">{c.name}</option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1 label-text">State/County</label>
        <select 
          required 
          className={inputClassName || "w-full bg-glass border border-glass-border rounded-2xl px-6 py-4 text-text-primary outline-none focus:border-accent/50 transition-all portal-input"}
          value={state}
          onChange={(e) => {
            setState(e.target.value);
            setCity('');
          }}
          disabled={!country}
        >
          <option value="" disabled className="bg-card-bg text-text-primary">Select State</option>
          {states.map(s => (
            <option key={s.isoCode} value={s.isoCode} className="bg-card-bg text-text-primary">{s.name}</option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1 label-text">City</label>
        <select 
          required 
          className={inputClassName || "w-full bg-glass border border-glass-border rounded-2xl px-6 py-4 text-text-primary outline-none focus:border-accent/50 transition-all portal-input"}
          value={city}
          onChange={(e) => setCity(e.target.value)}
          disabled={!state || cities.length === 0}
        >
          <option value="" disabled className="bg-card-bg text-text-primary">
            {cities.length === 0 && state ? "No Cities Found" : "Select City"}
          </option>
          {cities.map(c => (
            <option key={c.name} value={c.name} className="bg-card-bg text-text-primary">{c.name}</option>
          ))}
        </select>
      </div>
    </>
  );
};

export default LocationSelector;
