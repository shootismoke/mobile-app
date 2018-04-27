/**
 * Convert pm25 level to number of cigarettes
 * @see http://berkeleyearth.org/air-pollution-and-cigarette-equivalence/
 * @param {float} pm25
 */
const pm25ToCigarettes = api => {
  const pm25 =
    api.iaqi && api.iaqi.pm25 && api.iaqi.pm25.v ? api.iaqi.pm25.v : api.aqi;
  // pm25 = 22 is equivalent to 1 cigarette per day
  const cigarettes = pm25 / 22;
  // Format to 1 decimal
  return Math.round(cigarettes * 10) / 10;
};

export default pm25ToCigarettes;
