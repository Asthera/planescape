# Planescape Frontend

React single-page application for Planescape, a Ryanair round-trip flight search tool. It collects search parameters from the user, sends them to the backend API, and renders the resulting flight combinations as a price chart and flight cards.

See the [project README](../README.md) for an overview of the full system.

## Tech Stack

- [React 18](https://react.dev/)
- [Chart.js](https://www.chartjs.org/) via `react-chartjs-2` for the price-per-day chart
- [Create React App](https://create-react-app.dev/) tooling (`react-scripts`)

## Project Structure

```
frontend/
└── src/
    ├── App.js
    └── components/
        ├── SearchForm/            # Search inputs, posts to backend
        ├── FlightCard/            # Renders a single round-trip result
        ├── PriceChart/            # Chart.js price-per-day chart
        ├── TripDurationSelector/
        └── SingleSelectDropdown/
```

## Requirements

- Node.js 18+

## Setup

```bash
npm install
```

## Available Scripts

### `npm start`

Runs the app in development mode at [http://localhost:3000](http://localhost:3000). The page reloads automatically on changes. Requires the backend API to be running at `http://localhost:8000` (see [backend/README.md](../backend/README.md)).

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds a minified, production-ready bundle in the `build/` folder.

## Learn More

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). See the [CRA documentation](https://facebook.github.io/create-react-app/docs/getting-started) for details on configuration, deployment, and troubleshooting.