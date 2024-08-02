import React from 'react';
import './styles.css'; // Ensure this is correctly linked

function FlightCard({ flight }) {
  return (
    <div className="flight-card">
      {/* Outbound Flight Information */}
      <div className="flight-row">
        <span className="time">{new Date(flight.departureDate).toLocaleTimeString()}</span>
        <span className="airport">{flight.departureAirport}</span>
        <span className="arrow">---></span>
        <span className="airport">{flight.arriveAirport}</span>
        <span className="price-date">
          ${flight.priceForward} {flight.forwardCurrency} | {new Date(flight.departureDate).toLocaleDateString()}
        </span>
      </div>
      <hr />
      {/* Return Flight Information */}
      <div className="flight-row">
        <span className="time">{new Date(flight.backwardDepartureDate).toLocaleTimeString()}</span>
        <span className="airport">{flight.arriveAirport}</span>
        <span className="arrow">---></span>
        <span className="airport">{flight.departureAirport}</span>
        <span className="price-date">
          ${flight.priceBackward} {flight.backwardCurrency} | {new Date(flight.backwardDepartureDate).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}

export default FlightCard;
