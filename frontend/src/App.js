import React, { useState, useEffect } from 'react';

import './App.css';
import SearchForm from './components/SearchForm'
import FlightCard from './components/FlightCard';
import TripDurationSelector from './components/TripDurationSelector';
import PriceChart from './components/PriceChart';
import Papa from 'papaparse';

function App() {

  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };




  

  // Initialize the flight data with 30 days of prices
  const initialFlightData = [...Array(30)].map((_, index) => ({
    date: addDays(new Date('2021-01-01'), index).toISOString().slice(0, 10), // Format date as YYYY-MM-DD
    forwardPrice: 10 + Math.floor(Math.random() * 60), // Random price between 90 and 150
    backwardPrice: 15 + Math.floor(Math.random() * 65) // Random price between 85 and 150
  }));


  const [dataAvailable, setDataAvailable] = useState(false);  // State to track data availability
  const [flightData, setFlightData] = useState(initialFlightData);
  const [flightDays, setFlightDays] = useState({}); // used in handleFlightDataReceived

  const [flights, setFlights] = useState([]); // Mock or fetched flight data

  const [selectedDuration, setSelectedDuration] = useState(3); // Default duration
  const [durations, setDurations] = useState([]); // No initial durations
  const [dates, setDates] = useState([]);
  const [prices, setPrices] = useState([[], []]);  // Store two sets of prices

  const handleFlightDataReceived = (receivedData) => {
    console.log("APP.JS")
    console.log(receivedData)
    setFlightDays(receivedData[0]); // Update the state with the received data
    setDurations(Object.keys(receivedData[0]).map(day => parseInt(day)).sort((a, b) => a - b)); // Set durations based on days
    console.log(Object.keys(receivedData[0]).map(day => parseInt(day)))

    // Extracting dates and prices for the chart
    const chartDates = Object.keys(receivedData[1]);
    const forwardPrices = chartDates.map(date => receivedData[1][date]);
    const backwardPrices = chartDates.map(date => receivedData[2][date]);
    setDates(chartDates);
    setPrices([forwardPrices, backwardPrices]);


    setDataAvailable(true); // Set visibility for flight data dependent components
  };



  return (
    <div className="container">
      <h1>Plane Scape</h1>
      <SearchForm onFlightDataReceived={handleFlightDataReceived}/>

      {dataAvailable && (
        <>
          <PriceChart dates={dates} prices={prices} />
          {durations.length > 0 && (
            <TripDurationSelector
              durations={durations}
              onChange={setSelectedDuration}
            />
          )}
          <div>Selected Duration: {selectedDuration || 'Not selected'} days</div>
          {selectedDuration && (
            <div className="flights-container">
              {flightDays[selectedDuration] && flightDays[selectedDuration].map((flight, index) => (
                <FlightCard key={index} flight={flight} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}



export default App;
