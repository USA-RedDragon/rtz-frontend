# RTZ Frontend

This is the frontend to the RTZ (pronounced Routes) project. It is a fork of the [comma connect frontend](https://github.com/commaai/connect) with some changes to update dependencies, remove tracking, and enable its usage in RTZ.

## Changes from upstream

- Removed Google Analytics
- Removed Sentry
- Removed Plausible analytics
- Removed custom Comma analytics
- Installed Renovate to keep dependencies up to date
- Removed HERE API geocoding based on Comma networks RPC call
- Remove billing-related code
- User-configurable Mapbox token. The style is public at [Mapbox](https://api.mapbox.com/styles/v1/usa-reddragon/clyd2ske5010r01qr2lde0k3n.html?title=copy&access_token=pk.eyJ1IjoidXNhLXJlZGRyYWdvbiIsImEiOiJjbHlkMzl6cW4wMGtnMmxvcWY1MTZpeGg2In0.AHfA3k-lG_b48str7o3xQw&zoomwheel=true&fresh=true)
- Updated all dependencies to latest versions

## Development

- Install pnpm: <https://pnpm.io/installation>
- Install dependencies: `pnpm install`
- Start dev server: `pnpm dev`

## Contributing

If you don't have a comma device, connect has a demo mode with some example drives. This should allow for testing most functionality except for interactions with the device, such as getting the car battery voltage.

- Use best practices
- Write test cases
- Keep files small and clean
- Use branches / pull requests to isolate work. Don't do work that can't be merged quickly, find ways to break it up

## Libraries Used

There's a ton of them, but these are worth mentioning because they sort of affect everything.

- `React` - Object oriented components with basic lifecycle callbacks rendered by state and prop changes.
- `Redux` - Sane formal *global* scope. This is not a replacement for component state, which is the best way to store local component level variables and trigger re-renders. Redux state is for global state that many unrelated components care about. No free-form editing, only specific pre-defined actions. [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en) can be very helpful.
- `@mui` - Lots of fully featured highly customizable components for building the UIs with. Theming system with global and per-component overrides of any CSS values.
- `react-router-redux` - Mindlessly simple routing with convenient global access due to redux
