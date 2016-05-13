'use strict';

const
  Places = function Places() {
    // this.name = 'places';
    console.log('%s module loaded', 'places');
  },
  getPlaces = function getPlaces (google) {

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
              // console.log(results);
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

  parseResult = function parseResult (responseArr) {
    const
      fragment = document.createDocumentFragment();
    let
      div, li, h3, logo, logodiv, p, photo, tmp, photodiv, show;

    responseArr.forEach((obj) => {
      // console.log(obj);
      h3 = document.createElement('h3');
      logo = document.createElement('img');
      p = document.createElement('p');
      div = document.createElement('div');
      logodiv = document.createElement('div');

      h3.textContent = obj.name;
      div.appendChild(h3);
      logo.src = obj.icon;

      logodiv.className += ' logodiv';
      logodiv.appendChild(logo);
      div.appendChild(logodiv);

      if (obj.photos) {
        photo = document.createElement('img');
        // console.log(tmp[0]);
        tmp = obj.photos[0];
        photo.width = 200;
        photo.height = 200;
        photo.src = tmp.getUrl({maxHeight: 200, maxWidth: 200});
        photodiv = document.createElement('div');
        photodiv.className += ' photodiv';
        photodiv.appendChild(photo);
        photodiv.id = 'imgdiv';
        div.appendChild(photodiv);
      }

      if (obj.price_level) {
        p.textContent = `Value for Money: ${obj.price_level}`;
        div.appendChild(p);
      }

      // show = document.createElement('a');
      // show.href = '#cardItem';
      // show.textContent += 'Click Me!';
      // show.className += 'w3-btn w3-orange';
      // div.appendChild(show);

      div.className += ' w3-card-2 w3-hover-green';
      div.id = 'search-result';
      div.querySelector('h3').className += ' w3-red';

      fragment.appendChild(div);
    });

    // ulFrag.className+=' w3-ul w3-card-4 w3-center';
    // const divs = fragment.children;
    // for (let i = 0,ln = divs.length; i<ln; i++) {
    //   divs[i].className += ' w3-card-2 w3-hover-green';
    //   divs[i].id = 'search-result';
    //   divs[i].querySelector('h3').className += ' w3-red';
    // }

    return fragment;
  },

  createSlider = (responseArr) => {
    // all about creating slider for div cards
    let
      divImgFrag = document.createDocumentFragment(),
      //ul fragment to add numbered pagination with pagination arrows
      ulFrag = document.createDocumentFragment(),
      li, btnHref,

      fragment = parseResult(responseArr),
      // get each places div card results into the divResImgHolder
      // Convert this HTMLDom Object into an array
      divResImgHolder = Array.from(fragment.children),
      ln = divResImgHolder.length,

      // select slider window divimg holder and btn holder classes
      responseResults = document.getElementsByClassName('responseResults slider-holder')[0],
      divImgHolder = responseResults.getElementsByClassName('div-img-holder')[0],
      ulHolder = responseResults.getElementsByClassName('button-holder')[0];

    // adjust the slider-holder width
    // Fix the width of divImgHolder by calculating total div cards
    // 3 div cards per slide
    divImgHolder.style.width = `${Math.ceil(ln * 800)}px`;

    // populate data in frames
    divResImgHolder.forEach( (e, index) => {

      try {

        e.className += ' slider-image card';
        divImgFrag.appendChild(e);
        // console.log("divImgFrag works");
        // console.log(e);
      }
      catch (err) {
        console.error(err);
        console.log(e);
      }
    });

    // create back link
    li = document.createElement('li');
    btnHref = document.createElement('a');
    btnHref.href = '#';
    btnHref.textContent = 'Previous';
    btnHref.className += ' slider-change';
    // btnFrag.appendChild(btnHref);
    li.appendChild(btnHref);
    ulFrag.appendChild(li);
    for(let i=0, ln = divResImgHolder.length%5; i<ln; i++ ) {
      li = document.createElement('li');
      btnHref = document.createElement('a');
      btnHref.href = `#slider-div-${i}`;
      btnHref.textContent = `${i}`;
      btnHref.className += ' slider-change';
      // btnFrag.appendChild(btnHref);
      li.appendChild(btnHref);
      ulFrag.appendChild(li);
    }
    // create next link
    li = document.createElement('li');
    btnHref = document.createElement('a');
    btnHref.href = '#';
    btnHref.textContent = 'Next';
    btnHref.className += ' slider-change';
    // btnFrag.appendChild(btnHref);
    li.appendChild(btnHref);
    ulFrag.appendChild(li);


    try {
      divImgHolder.appendChild(divImgFrag);
      ulHolder.appendChild(ulFrag);
    }
    catch (e) {
      console.error('appending frag to document error!');
    }
  },

  slideTransit = () => {
    // all about button click transition of div slider
    let
      href, num=0,
      slider = document.querySelector('.div-img-holder'),
      sliderStyle = getComputedStyle(slider),
      width = parseInt( sliderStyle.width.match(/[-+][0-9]+|[0-9]+/) );

    Array.from(document.getElementsByClassName('slider-change')).forEach((e) => {
      e.addEventListener('click', function (evt) {
        let that= this;
        // id = evt.target.hash;
        href = that.href;
        href = href[href.length - 1];
        // console.log(href);
        // gets the href link number and yields multiple of frame width
        num = parseInt( sliderStyle.left.match(/[-+][0-9]+|[0-9]+/) );
        // console.log(`num = ${num} width=${width} href=${href}`);
        if (href === '#' && that.textContent === 'Previous') {
          // console.log(`Previous num = ${num}`);
          num = (num+800 <= 0) === true? num+800:num;
        }
        else if (href === '#' && that.textContent === 'Next') {
          // console.log(`Next num = ${num}`);
          num = (num-800 > parseInt(width/2) * -1 ) === true? num-800:num;
        }
        else {
          num = parseInt(href) * -800;
        }
        slider.style.left = `${num}px`;
      });
    });
  },

  detailedCard = () => {
    let
      p = document.querySelector('.detailedCard > p');

    p.textContent += 'Yay!';
  };

Places();

export default {getPlaces, createSlider, slideTransit, detailedCard};