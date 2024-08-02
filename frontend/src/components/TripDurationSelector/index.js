import React, { useState } from 'react';
import './styles.css'; // Ensure to create and link the CSS for styling

function TripDurationSelector({ durations, onChange }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Check if buttons should be disabled
  const isPrevDisabled = selectedIndex === 0;
  const isNextDisabled = selectedIndex === durations.length - 1;

  // Function to go to the next duration
  const nextDuration = () => {
    if (!isNextDisabled) {
      const nextIndex = (selectedIndex + 1) % durations.length;
      setSelectedIndex(nextIndex);
      onChange(durations[nextIndex]);
    }
  };

  // Function to go to the previous duration
  const prevDuration = () => {
    if (!isPrevDisabled) {
        
      const prevIndex = (selectedIndex - 1 + durations.length) % durations.length;
      setSelectedIndex(prevIndex);
      onChange(durations[prevIndex]);
    }
  };

  return (
    <div className="duration-selector">
      <button onClick={prevDuration} disabled={isPrevDisabled}>&lt;</button>
      <span>{durations[selectedIndex]} days</span>
      <button onClick={nextDuration} disabled={isNextDisabled}>&gt;</button>
    </div>
  );
}

export default TripDurationSelector;
