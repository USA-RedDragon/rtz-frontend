export function hasRoutesData(state) {
  if (!state) {
    return false;
  }
  if (!state.app) {
    return false;
  }
  if (state.app.devices && state.app.devices.length === 0 && !state.app.dongleId) {
    // new users without devices won't have segment metadata
    return true;
  }
  if (!state.app.routesMeta || !state.app.routesMeta.dongleId || state.app.routesMeta.start === null
    || state.app.routesMeta.end === null) {
    console.debug('No routes data at all');
    return false;
  }
  if (!state.app.routes) {
    console.debug('Still loading...');
    return false;
  }
  if (state.app.dongleId !== state.app.routesMeta.dongleId) {
    console.debug('Bad dongle id');
    return false;
  }
  const fetchRange = state.app.filter;
  if (fetchRange.start < state.app.routesMeta.start) {
    console.debug('Bad start offset');
    return false;
  }
  if (fetchRange.end > state.app.routesMeta.end) {
    console.debug('Bad end offset');
    return false;
  }

  return true;
}
