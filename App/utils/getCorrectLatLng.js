/**
 * Station given by the Waqi API is fucked up. Sometimes it's [lat, lng],
 * sometimes it's [lng, lat].
 * We check here with the user's real currentLocation coordinates, and take the
 * "closest" one.
 *
 * @param {*} currentLocation - An object containing {latitude, longitude}
 * representing the user's current location.
 * @param {*} station - An object containing {latitude, longitude} representing
 * the station's location.
 */
const getCorrectLatLng = (currentLocation, station) => {
  const d1 =
    Math.abs(currentLocation.latitude - station.latitude) +
    Math.abs(currentLocation.longitude - station.longitude);

  const d2 =
    Math.abs(currentLocation.latitude - station.longitude) +
    Math.abs(currentLocation.longitude - station.latitude);

  if (d1 < d2) return station;
  return {
    ...station,
    latitude: station.longitude,
    longitude: station.latitude
  };
};

export default getCorrectLatLng;
