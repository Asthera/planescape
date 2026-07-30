# Planescape

A flight search tool for Ryanair round trips. You pick a departure airport, a destination, a date range, and a trip duration range — it scrapes all matching outbound and return flights, pairs them up, and shows you the cheapest combinations grouped by trip length. Prices are shown in EUR regardless of the original currency.

## Example

A sample search result (Kosice ↔ Prague) showing the price chart and flight cards: [Example.pdf](./Example.pdf)




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

## Troubleshooting: Chrome / ChromeDriver version mismatch

`scraper.py` uses [`undetected-chromedriver`](https://github.com/ultrafunkamsterdam/undetected-chromedriver), which auto-downloads a `chromedriver` binary matching your installed Chrome version. If Chrome auto-updates (it does this silently in the background) after that binary was cached, you'll get errors like:

```
SessionNotCreatedException: session not created: This version of ChromeDriver only supports Chrome version XXX
```

**1. Check your installed Chrome version**

```bash
# macOS
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --version

# Linux
google-chrome --version

# Windows (PowerShell)
(Get-Item "C:\Program Files\Google\Chrome\Application\chrome.exe").VersionInfo.ProductVersion
```

**2. Check the cached chromedriver version**

`undetected-chromedriver` caches its downloaded driver under `~/.local/share/undetected_chromedriver` (Linux/macOS) or `%LOCALAPPDATA%\undetected_chromedriver` (Windows). You can check the binary's version directly:

```bash
~/.local/share/undetected_chromedriver/undetected_chromedriver --version
```

**3. Fix a mismatch**

- Easiest fix: delete the cached driver so it re-downloads a matching one on next run:
  ```bash
  rm -rf ~/.local/share/undetected_chromedriver
  ```
- If that doesn't help, Chrome and chromedriver major versions must match exactly (e.g. Chrome 126.x needs chromedriver 126.x). Update Chrome to the latest stable release, then clear the cache again.
- As a last resort, pin a specific major version in `scraper.py` by passing `version_main=<major_version>` to `uc.Chrome(...)`.

**4. Using a non-default Chrome install (e.g. Chrome Beta)**

If your cached chromedriver only matches a specific Chrome channel (e.g. Chrome Beta) and `undetected-chromedriver` can't find it automatically because it isn't at the standard install path, point it at the binary explicitly with the `CHROME_BINARY_PATH` environment variable:

```bash
# macOS example (Chrome Beta)
export CHROME_BINARY_PATH="/Applications/Google Chrome Beta.app/Contents/MacOS/Google Chrome Beta"
uvicorn main:app --reload
```

If unset, `scraper.py` leaves the browser path to `undetected-chromedriver`'s normal auto-detection.

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

## Roadmap

- Optimize scraper wait times (currently uses fixed sleeps in some places)
- Support multiple departure airports in a single search
- Add persistent storage for scraped results (avoid re-scraping the same dates)
