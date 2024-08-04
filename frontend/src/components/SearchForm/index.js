import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

// Importing components and styles
import SingleSelectDropdown from '../SingleSelectDropdown';
import "./styles.css";
function SearchForm({ onFlightDataReceived }) {

  const airportOptions = ['JFK', 'LAX', 'ORD', 'ATL', 'DFW', 'DEN', 'SFO', 'MIA', 'SEA', 'LAS', "BER", "BUD"];

  const [airports, setAirports] = useState([]);
  const [formData, setFormData] = useState({
    departureDate: '',
    returnDate: '',
    tripDurationMin: '',
    tripDurationMax: '',
    departureAirport: '',
    arrivalAirport: '',
    countOfPersons: 1,
    priceMin: 0.0,
    priceMax: 0.0
  });

  const handleChange = (event) => {
    const { name, value, type } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  useEffect(() => {
    // Load and parse the CSV data on component mount
    const loadAirports = async () => {
      const response = await fetch('./airports.csv');
      const reader = response.body.getReader();
      const result = await reader.read(); // raw data
      const decoder = new TextDecoder('utf-8');
      const csv = decoder.decode(result.value); // the CSV text
      const parsedData = Papa.parse(csv, { header: true });
      setAirports(parsedData.data.map(airport => ({
        label: airport.name,
        value: airport.iata_code
      })));
    };

    loadAirports();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Form Data Submitted:', formData);

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    };

    try {
      const response = await fetch('http://localhost:8000/flights', requestOptions);
      console.log(response)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Response from the server:', data);


      onFlightDataReceived(data.received_data)
  
      // Additional actions based on the response, e.g., show a success message, etc.
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error.message);
      //setDataAvailable(false); // Optionally handle this in parent as well 
      // Handle errors here, e.g., show an error message
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <label>
        Departure Date:
        <input type="date" name="departureDate" value={formData.departureDate} onChange={handleChange} required />
      </label>
      <label>
        Return Date:
        <input type="date" name="returnDate" value={formData.returnDate} onChange={handleChange} required />
      </label>
      <label>
        Min Trip Duration (days):
        <input type="number" name="tripDurationMin" value={formData.tripDurationMin} onChange={handleChange} required />
      </label>
      <label>
        Max Trip Duration (days):
        <input type="number" name="tripDurationMax" value={formData.tripDurationMax} onChange={handleChange} required />
      </label>
      <label>
        Departure Airport:
        <SingleSelectDropdown
          options={airports}
          label=""
          onChange={(selected) => setFormData({ ...formData, departureAirport: selected })}
        />
      </label>
      <label>
        Arrival Airport:
        <SingleSelectDropdown
          options={airports}
          label=""
          onChange={(selected) => setFormData({ ...formData, arrivalAirport: selected })}
        />
      </label>
      <label>
        Count of Persons:
        <input type="number" name="countOfPersons" value={formData.countOfPersons} onChange={handleChange} required />
      </label>
      <label>
        Max Price:
        <input type="number" name="priceMax" value={formData.priceMax} onChange={handleChange} />
      </label>
      <button type="submit">Search</button>
    </form>
  );
}

export default SearchForm;
