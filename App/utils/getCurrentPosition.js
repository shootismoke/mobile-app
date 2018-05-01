/**
 * Get GPS location as a Promise
 */
const getCurrentPosition = (options = {}) => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
};

export default getCurrentPosition;
