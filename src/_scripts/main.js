// Main javascript entry point
// Should handle bootstrapping/starting application

'use strict';

import $ from 'jquery';
import Link from '../_modules/link/link';
import searchLoc from '../_modules/landing/landing';
import * as places from '../_modules/places/places';

$(() => {
  new Link(); // Activate Link modules logic

  (locationService => {
    document.getElementById('searchgo').addEventListener('click', () => {
      searchLoc()
      .then((val) => {
        let
          [lat, lng] = val,
          placeRes = places.getPlaces(google);

        [lat, lng] = [parseFloat(lat), parseFloat(lng)];
        console.log(`lat ${lat} lng ${lng}` );

        return placeRes(lat, lng, 'restaurant');
      }).catch((err) => {
        console.log(err);
      }).then((results) => {
        // console.log(results);
        places.createSlider(results);
        places.slideTransit();
        places.detailedCard();
      }).catch((err) => {
        console.log(err);
      });
    });

    console.log('All systems green');
  })();


});
