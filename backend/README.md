# Planescape Backend

FastAPI service that powers Planescape's flight search. It scrapes Ryanair for outbound and return flights across a date range, pairs them into round trips, and returns the cheapest combinations grouped by trip duration.

See the [project README](../README.md) for an overview of the full system, including setup and troubleshooting instructions.

## Tech Stack

- [FastAPI](https://fastapi.tiangolo.com/) — REST API
- [Selenium](https://www.selenium.dev/) via [`undetected-chromedriver`](https://github.com/ultrafunkamsterdam/undetected-chromedriver) — Ryanair website scraping
- [CurrencyConverter](https://pypi.org/project/CurrencyConverter/) — converts prices to EUR

## Project Structure

```
backend/
├── main.py               # REST API entry point (POST /flights)
├── scraper.py             # Selenium-based Ryanair scraper (RyanAir class)
├── ryanairfinder.py       # Older API-based finder (kept for reference)
├── my_types.py            # Shared dataclasses (SearchParams, FlightProposition, OneWayFlight)
└── convert_currency.py    # EUR price conversion helper
```

## Requirements

- Python 3.10+
- Google Chrome installed (used by `undetected-chromedriver`)
- [Miniconda](https://docs.conda.io/en/latest/miniconda.html) or Anaconda

## Setup

```bash
conda create -n planescape python=3.10
conda activate planescape
pip install -r requirements.txt
```

## Running

```bash
uvicorn main:app --reload
```

The API runs on [http://localhost:8000](http://localhost:8000).

## API

### `POST /flights`

Accepts a `SearchParams` payload (departure/arrival airports, date range, trip duration range, passenger count, price bounds) and returns `[flightPropositions, forwardPricesPerDay, backwardPricesPerDay]`.

See [`my_types.py`](./my_types.py) for the full request/response schema.

## Notes

- Scraping is I/O-bound and can take several minutes for wide date ranges, since it navigates the Ryanair site day by day.
- The scraper writes debug screenshots (`before*.png`, `after*.png`, `nowsecure*.png`) to this directory during a run. These are safe to delete and are excluded from version control.
- `ryanairfinder.py` uses the Ryanair public API directly (faster, no browser needed), but the endpoint is unofficial and unsupported. `scraper.py` is the active implementation used by the API.
- Chrome/ChromeDriver version mismatches are a common source of scraper failures — see the [troubleshooting section](../README.md#troubleshooting-chrome--chromedriver-version-mismatch) in the project README.