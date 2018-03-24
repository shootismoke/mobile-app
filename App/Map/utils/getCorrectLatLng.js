const getCorrectLatLng = (gps, station) => {
  // Station given by the Waqi API is fucked up. Sometimes it's [lat, lng],
  // sometimes it's [lng, lat].
  // We check here with the user's real GPS coordinates, and take the "closest"
  // one.
  const d1 =
    Math.abs(gps.latitude - station.latitude) +
    Math.abs(gps.longitude - station.longitude);

  const d2 =
    Math.abs(gps.latitude - station.longitude) +
    Math.abs(gps.longitude - station.latitude);

  if (d1 < d2) return station;
  return {
    ...station,
    latitude: station.longitude,
    longitude: station.latitude
  };
};

export default getCorrectLatLng;
