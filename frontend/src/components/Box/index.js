import React from 'react';
import './styles.css';

function Box() {


  return (
    <div className="box">
    <div className="group">
      <div className="overlap-group">
        <div className="text-wrapper">18:10</div>
        <img className="arrow" alt="Arrow" src="arrow-1.svg" />
        <div className="div">17:10</div>
      </div>
    </div>
  </div>
  );
}

export default Box;
