# WeatherIQ — Live Weather Intelligence

A responsive Next.js weather dashboard for any city worldwide. Built for GitHub + Vercel and powered by the free Open-Meteo APIs.

## Features
- Search cities worldwide with autocomplete (Open-Meteo Geocoding)
- Current weather: temperature, feels-like, humidity, wind, pressure and UV index
- Seven-day forecast with daily highs/lows, conditions and precipitation probability
- Next 24-hour temperature trend chart
- Seven-day averages and expected rainfall summary
- Sunrise, sunset and maximum wind
- Live GMT/UTC and India Standard Time clocks
- City-local forecast timezone, Celsius/Fahrenheit switch
- Responsive desktop and mobile layout
- No API key or environment variables required

## Free weather API
Uses Open-Meteo Forecast API and Geocoding API. The free hosted API requires no key for non-commercial use, subject to its fair-use limits. Attribution is included in the app footer. For commercial use, review Open-Meteo's current terms and pricing.

- Forecast docs: https://open-meteo.com/en/docs
- Geocoding docs: https://open-meteo.com/en/docs/geocoding-api
- Terms/pricing: https://open-meteo.com/en/pricing

## Run locally
1. Install Node.js 18.17+.
2. Extract this ZIP.
3. In the project folder, run:

   ```bash
   npm install
   npm run dev
   ```

4. Open http://localhost:3000

## Deploy to Vercel
1. Create a new GitHub repository (for example `weatheriq`).
2. Extract this ZIP and upload the project files to the repository root.
3. Commit and push to GitHub.
4. In Vercel, choose **Add New → Project**, import the GitHub repository.
5. Keep the default Next.js settings and click **Deploy**.
6. No API keys or environment variables are required.

Every push to the connected GitHub main branch triggers a new Vercel deployment.

## API routes
- `GET /api/geocode?q=London` — city autocomplete
- `GET /api/weather?lat=51.5&lon=-0.12&name=London&unit=celsius` — current conditions, hourly and seven-day forecast

## Notes
- "Weekly averages" are calculated from the seven forecast days, not a historical climate normal.
- Weather forecast values are model-based estimates and may change as forecast models update.
- Forecast timestamps and sunrise/sunset follow the selected location's local timezone. The GMT and IST clocks are independent live references.
- Browser geolocation requires permission and HTTPS (Vercel deployments use HTTPS).
