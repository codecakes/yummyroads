// Main javascript entry point
// Should handle bootstrapping/starting application

'use strict';

import $ from 'jquery';
import Link from '../_modules/link/link';
import * as landing from '../_modules/landing/landing';
import * as places from '../_modules/places/places';


$(() => {

  (() => {
    // makes life so much better esp w/ DOM
    if (!window.jQuery) {
      window.jQuery = $;
    }
  })();

  new Link(); // Activate Link modules logic

  // locationService
  ($ => {
    // document.getElementById('searchgo').addEventListener('click', () => {
    $('#searchgo').click(() => {
      landing.searchLoc()
      .then((val) => {
        let
          [lat, lng] = val,
          placeRes = places.getPlaces(google);

        [lat, lng] = [parseFloat(lat), parseFloat(lng)];
        console.log(`lat ${lat} lng ${lng}` );

        return placeRes(lat, lng, 'restaurant');
      })
      .catch((err) => {
        console.log(err);
      })
      .then((results) => {
        // console.log(results);
        places.createSlider(results, $);
        places.slideTransit($);
        places.cardToMap($, google);

        let
          Promises = [],
          ln = results.length, count = 0, result,
          id = setInterval(() => {
            if (count < ln) {
              result = results[count];
              Promises.push( places.placeDetails(result)(google, result) );
              count++;
            }
            else {
              clearInterval(id);
              console.log('Promises');
              Promise.all(Promises)
              .then((promiseArr) => {
                Promise.all(promiseArr)
                .then( (Results) => {
                  places.detailedCardAsync(Results, $, google);
                  places.renderMap(Results, google);
                  $('#map').show();
                }, (err) => {
                  console.error(err);
                });
              });
            }
          }, 1000);
      })
      .catch((err) => {
        console.log(err);
      });
    });

    console.log('All systems green');
  })(window.jQuery);


});
