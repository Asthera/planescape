import React, { useState, useEffect } from 'react';

import './App.css';
import SearchForm from './components/SearchForm'
import FlightCard from './components/FlightCard';
import TripDurationSelector from './components/TripDurationSelector';
import PriceChart from './components/PriceChart';


function App() {

  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  // Initialize the flight data with 30 days of prices
  const initialFlightData = [...Array(30)].map((_, index) => ({
    date: addDays(new Date('2021-01-01'), index).toISOString().slice(0, 10), // Format date as YYYY-MM-DD
    forwardPrice: 90 + Math.floor(Math.random() * 60), // Random price between 90 and 150
    backwardPrice: 85 + Math.floor(Math.random() * 65) // Random price between 85 and 150
  }));

  const [flightData, setFlightData] = useState(initialFlightData);

  const [flights, setFlights] = useState([]); // Mock or fetched flight data

  const [selectedDuration, setSelectedDuration] = useState(3); // Default duration
  const durations = [3, 5, 7, 10, 14]; // Example durations

  useEffect(() => {
    // Fetch or simulate fetching flight data
    setFlights([
      {
        departureDate: new Date(),
        arriveDate: new Date(),
        backwardDepartureDate: new Date(),
        backwardArriveDate: new Date(),
        departureAirport: 'JFK',
        arriveAirport: 'LAX',
        priceForward: 300,
        forwardCurrency: 'USD',
        priceBackward: 280,
        backwardCurrency: 'USD'
      },
      {
        departureDate: new Date(),
        arriveDate: new Date(),
        backwardDepartureDate: new Date(),
        backwardArriveDate: new Date(),
        departureAirport: 'JFK',
        arriveAirport: 'LAX',
        priceForward: 300,
        forwardCurrency: 'USD',
        priceBackward: 280,
        backwardCurrency: 'USD'
      },
      {
        departureDate: new Date(),
        arriveDate: new Date(),
        backwardDepartureDate: new Date(),
        backwardArriveDate: new Date(),
        departureAirport: 'JFK',
        arriveAirport: 'LAX',
        priceForward: 300,
        forwardCurrency: 'USD',
        priceBackward: 280,
        backwardCurrency: 'USD'
      }
    ]);
  }, []);


  return (
    <div className="container">
      <h1>Plane Scape</h1>
      <SearchForm/>
      <PriceChart flightData={flightData} />
      <TripDurationSelector
        durations={durations}
        onChange={(duration) => setSelectedDuration(duration)}
      />
      {/* Further components or content can go here */}
      <div>Selected Duration: {selectedDuration} days</div>
      <div className="flights-container">
      {flights.map((flight, index) => (
        <FlightCard key={index} flight={flight} />
      ))}
    </div>
    </div>
  );
}



export default App;
