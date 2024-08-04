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
        option.label && option.label.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filter.slice(0, 3));
    } else {
      setSuggestions([]);
    }
  };
  

  // Function to handle selection
  const handleSelect = (option) => {
    console.log("hadleSelect")
    console.log(option.value, option.label)
    
    onChange(option.value);  // Update the parent component state with the option's value
    setInputValue(option.label);  // Set input to show selected option's label
    setSuggestions([]);  // Clear suggestions after selection
  };

  return (
    <div className="single-select-dropdown">
      <label>{label}</label> {/* Display the label */}
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Start typing..."
      />
      {suggestions.length > 0 && (
        <ul>
          {suggestions.map((option, index) => (
            <li key={index} onClick={() => handleSelect(option)}>{option.label}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SingleSelectDropdown;
