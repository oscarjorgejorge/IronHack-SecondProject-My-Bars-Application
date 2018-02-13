'use strict';

function main () {
  console.log(myBars);

  function initMap () {
    const mapOptions = {
      zoom: 14,
      center: new google.maps.LatLng(41.396298, 2.191881)

    };
    const map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // const infoWindow = new google.maps.InfoWindow({map: map});

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        let icon = {
          url: '../images/currentpositionmarker.png',
          scaledSize: new google.maps.Size(20, 20)
        };

        const myMarker = new google.maps.Marker({
          position: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          },
          icon: icon,
          map: map
        });

        // infoWindow.setPosition(pos);
        // infoWindow.setContent('Location found.');
        map.setCenter(pos);
      }, function () {
        handleLocationError(true, infoWindow, map.getCenter());
      });
    } else {
    // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  }

  function handleLocationError (browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation
      ? 'Error: The Geolocation service failed.'
      : 'Error: Your browser doesn\'t support geolocation.');
  }

  initMap();
}

window.onload = main;
