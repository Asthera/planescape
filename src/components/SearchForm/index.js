import React, { useState } from 'react';
import "./styles.css"

function SearchForm() {
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

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form Data Submitted:', formData);
    // Here you would typically handle the API call
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
        <input type="text" name="departureAirport" value={formData.departureAirport} onChange={handleChange} required />
      </label>
      <label>
        Arrival Airport:
        <input type="text" name="arrivalAirport" value={formData.arrivalAirport} onChange={handleChange} required />
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
