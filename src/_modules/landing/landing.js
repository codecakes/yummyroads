'use strict';

const searchLoc = (function () {
    const
      Landing = function Landing() {
        console.log('%s module loaded', 'landing');
      },

      showPosition = function showPosition(position) {
        return [position.coords.latitude, position.coords.longitude];
      },
      showError =
      function showError(error) {
        let res;
        switch(error.code) {
        case error.PERMISSION_DENIED:
          res = 'User denied the request for Geolocation.';
          break;
        case error.POSITION_UNAVAILABLE:
          res = 'Location information is unavailable.';
          break;
        case error.TIMEOUT:
          res = 'The request to get user location timed out.';
          break;
        case error.UNKNOWN_ERROR:
          res = 'An unknown error occurred.';
          break;
        }
        return res;
      },
      getLocation = function getLocation() {
        return new Promise(function (resolve, reject) {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition( (pos) => {
              resolve(showPosition(pos));
            },
            (err) => {
              reject(Error(showError(err)));
            }, {enableHighAccuracy:true});
          }
          else {
            reject(Error('Geolocation is not supported by this browser.'));
          }
        });
      };

    Landing();
    return getLocation;
  })(),

  searchText = function searchText () {
    // TODO: implement Text Search Requests API
  };

export default {searchLoc, searchText};
