'use strict';

const
  Places = function Places() {
    // this.name = 'places';
    console.log('%s module loaded', 'places');
  },
  getPlaces = function getPlaces (google) {
    // Gets Lat, Lng of a place and queries Google Places and Maps Api
    let
      map,
      service,
      infowindow,

      init = function initialize(lat, lng, typePlace, objArgs) {
        infowindow = new google.maps.InfoWindow();
        let
          place = new google.maps.LatLng(lat,lng),
          request = {
            location: place,
            radius: '5000',
            type: [typePlace]
          },
          createMarker = function createMarker(place) {
            let
              placeLoc = place.geometry.location,
              that = this,
              marker = new google.maps.Marker({
                map: map,
                position: placeLoc,
              });

            google.maps.event.addListener(marker, 'click', function() {
              infowindow.setContent(place.name);
              infowindow.open(map, that);
            });
          };

        Object.assign(request, objArgs);

        map = new google.maps.Map(document.getElementById('map'), {
          center: place,
          zoom: 15
        });

        service = new google.maps.places.PlacesService(map);

        return new Promise((resolve, reject) => {
          service.nearbySearch(request, function callback(results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
              // results = JSON.parse(JSON.stringify(results));
              console.log(`found ${results.length} results`);
              console.log(results);
              results.forEach((result) => {
                createMarker(result);
              });
              resolve(results);
            }
            else {
              reject(Error(status));
            }
          });
        });
      };
    return init;
  },

  parseResult = function parseResult (responseArr, $) {
    const
      $fragment = $( document.createDocumentFragment() );
    let
      $div, $h3, $logo, $logodiv, $p, $photo, $tmp, $photodiv, $show;

    responseArr.forEach( (obj, index) => {
      // console.log(obj);
      $h3 = $('<h3>');
      $logo = $('<img>');
      $p = $('<p>');
      $div = $('<div>');
      $logodiv = $('<div>');

      $h3.text(obj.name);
      $div.append($h3);
      $logo.attr('src',obj.icon);

      $logodiv.addClass('logodiv');
      $logodiv.append($logo);
      $div.append($logodiv);

      if (obj.photos) {
        $photo = $('<img>', {'class': 'w3-circle'});
        // console.log(tmp[0]);
        $tmp = obj.photos[0];
        $photo.attr('width', 200);
        $photo.attr('height', 200);
        $photo.attr('src', $tmp.getUrl({maxHeight: 200, maxWidth: 200}));
        $photodiv = $('<div>');
        $photodiv.addClass('photodiv');
        $photodiv.append($photo);
        $photodiv.attr('id','imgdiv');
        $div.append($photodiv);
      }

      if (obj.price_level) {
        $p.text(`Value for Money: ${obj.price_level}`);
        $div.append($p);
      }

      $div.addClass('w3-card-2 w3-hover-green');
      $div.attr('id', 'search-result');
      $div.find('h3').addClass('w3-red');

      $div.append( $('<hr>') );
      $show = $('<a>');
      $show.attr('href',`#cardItem-${index}`);
      $show.text('Show More');
      $show.addClass('w3-btn w3-orange');
      $div.append($show);

      $fragment.append($div);
    });

    return $fragment;
  },

  createSlider = (responseArr, $) => {
    // all about creating slider for div cards navigation
    let
      $divImgFrag = $( document.createDocumentFragment() ),
      //ul fragment to add numbered pagination with pagination arrows
      $ulFrag = $( document.createDocumentFragment() ),
      $li, $btnHref,

      // get each places div card results into the divResImgHolder
      // Convert this HTMLDom Object into an array
      divResImgHolder = Array.from( parseResult(responseArr, $).children() ),
      ln = divResImgHolder.length,

      // select slider window divimg holder and btn holder classes
      $responseResults = $('.responseResults.slider-holder'),
      $divImgHolder = $responseResults.find('.div-img-holder'),
      $ulHolder = $responseResults.find('.button-holder');

    // adjust the slider-holder width
    // Fix the width of divImgHolder by calculating total div cards
    // 3 div cards per slide
    $divImgHolder.css('width', `${Math.ceil(ln * 800)}px`);

    // populate data in frames
    divResImgHolder.forEach( (e, index) => {

      try {

        $(e).addClass('slider-image card');
        $divImgFrag.append(e);
        // console.log("divImgFrag works");
        // console.log(e);
      }
      catch (err) {
        console.error(err);
        console.log(e);
      }
    });

    // create back link
    $li = $('<li>');
    $btnHref = $('<a>');
    $btnHref.attr('href','#');
    $btnHref.text('Previous');
    $btnHref.addClass('slider-change');
    $li.append($btnHref);
    $ulFrag.append($li);

    for(let i=0, ln = divResImgHolder.length%5; i<ln; i++ ) {
      $li = $('<li>');
      $btnHref = $('<a>');
      $btnHref.attr('href',`#slider-div-${i}`);
      $btnHref.text(`${i}`);
      $btnHref.addClass('slider-change');
      $li.append($btnHref);
      $ulFrag.append($li);
    }
    // create next link
    $li = $('<li>');
    $btnHref = $('<a>');
    $btnHref.attr('href','#');
    $btnHref.text('Next');
    $btnHref.addClass('slider-change');
    $li.append($btnHref);
    $ulFrag.append($li);


    try {
      $divImgHolder.append($divImgFrag);
      $ulHolder.append($ulFrag);
    }
    catch (e) {
      console.error('appending frag to document error!');
    }
  },

  slideTransit = ($) => {
    // all about button click transition of div slider
    let
      href, num=0,
      $slider = $('.div-img-holder'),
      // sliderStyle = getComputedStyle(slider),
      width = parseInt( $slider.css('width').match(/[-+][0-9]+|[0-9]+/) );

    $.each( $('.slider-change'), (index, element) => {
      $(element).click( function (evt) {
        const that= this;
        // id = evt.target.hash;
        href = that.href;
        href = href[href.length - 1];
        // console.log(href);
        // gets the href link number and yields multiple of frame width
        num = parseInt( $slider.css('left').match(/[-+][0-9]+|[0-9]+/) || 0 );
        // console.log(`num = ${num} width=${width} href=${href}`);
        if (href === '#' && $(that).text() === 'Previous') {
          evt.stopPropagation();
          evt.preventDefault();
          // console.log(`Previous num = ${num}`);
          num = (num+800 <= 0) === true? num+800:num;
        }
        else if (href === '#' && $(that).text() === 'Next') {
          // console.log(`Next num = ${num}`);
          evt.stopPropagation();
          evt.preventDefault();
          num = (num-800 > parseInt(width/2) * -1 ) === true? num-800:num;
        }
        else {
          num = parseInt(href) * -800;
        }
        $slider.css('left', `${num}px`);
      }.bind(element) );
    });
  },

  detailedCard = (results, $) => {
    const
      $detailedCard = $('.detailedCard'),
      $frag = $( document.createDocumentFragment() );
    let $div, $name, $photo, $openStatus, $rating, $vicinity, $type;

    $.each(results, (index, result) => {
      $div = $('<div>', {'id':`cardItem-${index}`, 'class': 'w3-container w3-card-8'});

      $name = $('<h3>', {'class':'w3-hover-shadow w3-blue'});
      $name.text(`${result.name}`);
      if (result.photos) {
        $photo = $('<img>', {'src':result.photos[0].getUrl({maxHeight: 200, maxWidth: 200}), 'class': 'w3-center' });
      }
      else {
        $photo = $('<img>', {'text':'Image not available'});
      }

      $openStatus = $('<p>', {'class': 'w3-blue w3-center'});
      if (result.opening_hours) {
        $openStatus.text(`Open?: ${result.opening_hours.open_now? 'Yes':'No' }`);
      }
      else {
        $openStatus.text('Open?: Not Sure. Better Call \'em up!');
      }

      $rating = $('<p>', {'class': 'w3-dark-grey'});
      $rating.text(`Rating: ${!!result.rating?result.rating:'No ratings yet!'}`);
      $vicinity = $('<p>', {'class':'w3-center'});
      $vicinity.text(`${result.vicinity}`);
      $type = $('<p>');
      $type.text(`${result.types[0]}`);

      $div.append($name);
      $div.append($type);
      $div.append($photo);
      $div.append($rating);
      $div.append($vicinity);
      $div.append($openStatus);

      $frag.append( $div );
      // $('.detailedCard > p').text('Yay!');
    });

    $detailedCard.append($frag);
  };

Places();

export default {getPlaces, createSlider, slideTransit, detailedCard};