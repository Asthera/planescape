import React from 'react';
import './styles.css'; // Ensure this is correctly linked

function FlightCard({ flight }) {
  // Options for formatting time to show only hours and minutes
  const timeOptions = { hour: '2-digit', minute: '2-digit' };

  return (
    <div className="flight-card">
      {/* Outbound Flight Information */}
      <div className="flight-row">
        <span className="time">{new Date(flight.departureDate).toLocaleTimeString([], timeOptions)}</span>
        <span className="airport">{flight.departureAirport}</span>
        <span className="arrow">---></span>
        <span className="time">{new Date(flight.arriveDate).toLocaleTimeString([], timeOptions)}</span>
        <span className="airport">{flight.arriveAirport}</span>
        <span className="price-date">
          ${flight.priceForward} {flight.forwardCurrency} | {new Date(flight.departureDate).toLocaleDateString()}
        </span>
      </div>
      <hr />
      {/* Return Flight Information */}
      <div className="flight-row">
        <span className="time">{new Date(flight.backwardDepartureDate).toLocaleTimeString([], timeOptions)}</span>
        <span className="airport">{flight.arriveAirport}</span>
        <span className="arrow">---></span>
        <span className="time">{new Date(flight.backwardArriveDate).toLocaleTimeString([], timeOptions)}</span>
        <span className="airport">{flight.departureAirport}</span>
        <span className="price-date">
          ${flight.priceBackward} {flight.backwardCurrency} | {new Date(flight.backwardDepartureDate).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}

export default FlightCard;
