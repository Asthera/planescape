# Planescape

A flight search tool for Ryanair round trips. You pick a departure airport, a destination, a date range, and a trip duration range — it scrapes all matching outbound and return flights, pairs them up, and shows you the cheapest combinations grouped by trip length. Prices are shown in EUR regardless of the original currency.

## Architecture

```
planescape/
├── backend/        # Python + FastAPI
│   ├── main.py         # REST API entry point  (POST /flights)
│   ├── scraper.py      # Selenium-based Ryanair scraper (RyanAir class)
│   ├── ryanairfinder.py# Older API-based finder (kept for reference)
│   ├── my_types.py     # Shared dataclasses (SearchParams, FlightProposition, OneWayFlight)
│   └── convert_currency.py
└── frontend/       # React 18 SPA
    └── src/
        ├── App.js
        └── components/
            ├── SearchForm/         # Search inputs, posts to backend
            ├── FlightCard/         # Renders a single round-trip result
            ├── PriceChart/         # Chart.js price-per-day chart
            ├── TripDurationSelector/
            └── SingleSelectDropdown/
```

## How it works

1. The React form (`SearchForm`) POSTs search params to `http://localhost:8000/flights`.
2. FastAPI (`main.py`) creates a `RyanAir` scraper instance and calls `find_two_way_flights`.
3. The scraper opens the Ryanair website with `undetected-chromedriver`, navigates day by day across the requested date range, and collects all available outbound flights. Then it restarts and does the same for the return direction.
4. `find_flight_propositions` pairs every outbound flight with every return flight whose gap falls within `tripDurationMin`–`tripDurationMax` days. Results are sorted cheapest-first.
5. The frontend receives `[flightPropositions, forwardPricesPerDay, backwardPricesPerDay]` and renders a price chart plus flight cards for the selected trip duration.

## Requirements

### Backend

- Python 3.10+
- Google Chrome installed (used by undetected-chromedriver)
- [Miniconda](https://docs.conda.io/en/latest/miniconda.html) or Anaconda

Create and activate a conda environment:

```bash
conda create -n planescape python=3.10
conda activate planescape
pip install -r backend/requirements.txt
```

To activate the environment in future sessions:

```bash
conda activate planescape
```

### Frontend

- Node.js 18+

```bash
cd frontend
npm install
```

## Running

**Backend** (from the `backend/` directory):

```bash
uvicorn main:app --reload
```

The API runs on `http://localhost:8000`.

**Frontend** (from the `frontend/` directory):

```bash
npm start
```

The app runs on `http://localhost:3000`.

Open `http://localhost:3000` in your browser and use the search form.

## Search parameters

| Field | Description |
| --- | --- |
| Departure Date | Start of the outbound date range to search |
| Return Date | End of the return date range to search |
| Min Trip Duration | Minimum nights at destination |
| Max Trip Duration | Maximum nights at destination |
| Departure Airport | IATA code (e.g. `BER`) |
| Arrival Airport | IATA code (e.g. `BUD`) |
| Count of Persons | Number of passengers |
| Max Price | Maximum price per one-way leg in EUR (0 = no limit) |

## Notes

- Scraping takes time — navigating day by day and waiting for Ryanair's JavaScript to load means a wide date range can take several minutes.
- The scraper saves debug screenshots (`before*.png`, `after*.png`, `nowsecure*.png`) in the `backend/` directory during a run. These can be deleted freely.
- `ryanairfinder.py` uses the Ryanair public API directly (faster, no browser needed) but the endpoint is unofficial and may stop working. The active scraper in `scraper.py` is the one used by the API.
- All prices are converted to EUR using the `currency-converter` library.

## TODO

- Optimize scraper wait times (currently uses fixed sleeps in some places)
- Add Tor / proxy rotation to reduce the chance of being blocked
- Support multiple departure airports in a single search
- Add persistent storage for scraped results (avoid re-scraping the same dates)
