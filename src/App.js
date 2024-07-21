import React, { useState, useEffect } from 'react';

import './App.css';
import SearchForm from './components/SearchForm'
import FlightCard from './components/FlightCard';
import TripDurationSelector from './components/TripDurationSelector';


function App() {

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
