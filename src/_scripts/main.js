// Main javascript entry point
// Should handle bootstrapping/starting application

'use strict';

import $ from 'jquery';
import Link from '../_modules/link/link';
import searchLoc from '../_modules/landing/landing';

$(() => {
  new Link(); // Activate Link modules logic
  document.getElementById('searchgo').addEventListener('click', () => {
    searchLoc()
    .then((val) => {
      let [lat, lng] = val;
      console.log(`lat ${lat} lng ${lng}` );
    })
    .catch((err) => {
      console.log(err);
    });
  });
  console.log('All systems green');
});
