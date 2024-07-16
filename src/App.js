import './App.css';

function App() {
  return (
    <div className="container">
      <h1>Plane Scape</h1>
      <SearchForm />
    </div>
  );
}

function SearchForm() {
  // This is where we will add form handling logic later
  return (
    <form className="search-form">
      <label>
        Departure Date:
        <input type="date" id="departure-date" required />
      </label>
      {/* Add other form fields here similarly */}
      <button type="submit">Search</button>
    </form>
  );
}

export default App;
