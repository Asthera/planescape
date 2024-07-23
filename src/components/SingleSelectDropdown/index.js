import React, { useState } from 'react';
import './styles.css'; // Ensure to create and link the CSS for styling

function SingleSelectDropdown({ options, label, onChange }) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // Handle input changes to filter suggestions
  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    if (value.length > 0) {
      const filter = options.filter(option =>
        option.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filter);
    } else {
      setSuggestions([]);
    }
  };

  // Function to handle selection
  const handleSelect = (option) => {
    onChange(option);  // Update the parent component state
    setInputValue(option);  // Set input to show selected option
    setSuggestions([]);  // Clear suggestions after selection
  };

  return (
    <div className="single-select-dropdown">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Start typing..."
      />
      {suggestions.length > 0 && (
        <ul>
          {suggestions.map(option => (
            <li key={option} onClick={() => handleSelect(option)}>{option}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SingleSelectDropdown;
