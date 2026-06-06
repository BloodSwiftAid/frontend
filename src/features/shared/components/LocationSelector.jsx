import React, { useState, useEffect } from 'react';
import { Country, State, City } from 'country-state-city';

const LocationSelector = ({ country, setCountry, state, setState, lga, setLga, city, setCity, inputClassName }) => {
  const [states, setStates] = useState([]);
  const [lgas, setLgas] = useState([]);

  useEffect(() => {
    // Default country to Nigeria
    if (setCountry && country !== 'NG') {
      setCountry('NG');
    }
  }, [country]);

  useEffect(() => {
    // Nigeria is 'NG'
    setStates(State.getStatesOfCountry('NG'));
  }, []);

  useEffect(() => {
    if (state) {
      // The country-state-city package returns LGAs/Cities for the state
      setLgas(City.getCitiesOfState('NG', state));
    } else {
      setLgas([]);
    }
  }, [state]);

  const defaultClassName = "w-full bg-glass border border-glass-border rounded-2xl px-6 py-4 text-text-primary outline-none focus:border-accent/50 transition-all portal-input";
  const className = inputClassName || defaultClassName;

  return (
    <>
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1 label-text">Country</label>
        <select 
          required 
          className={className}
          value="NG"
          disabled
        >
          <option value="NG" className="bg-card-bg text-text-primary">Nigeria</option>
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1 label-text">State</label>
        <select 
          required 
          className={className}
          value={state || ''}
          onChange={(e) => {
            setState(e.target.value);
            if (setLga) setLga('');
          }}
        >
          <option value="" disabled className="bg-card-bg text-text-primary">Select State</option>
          {states.map(s => (
            <option key={s.isoCode} value={s.isoCode} className="bg-card-bg text-text-primary">{s.name}</option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1 label-text">LGA</label>
        <select 
          required 
          className={className}
          value={lga || ''}
          onChange={(e) => setLga && setLga(e.target.value)}
          disabled={!state || lgas.length === 0}
        >
          <option value="" disabled className="bg-card-bg text-text-primary">
            {lgas.length === 0 && state ? "No LGAs Found" : "Select LGA"}
          </option>
          {lgas.map(c => (
            <option key={c.name} value={c.name} className="bg-card-bg text-text-primary">{c.name}</option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1 label-text">City</label>
        <input 
          required 
          type="text"
          className={className}
          value={city || ''}
          onChange={(e) => setCity && setCity(e.target.value)}
          placeholder="Enter City"
        />
      </div>
    </>
  );
};

export default LocationSelector;
