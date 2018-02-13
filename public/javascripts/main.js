'use strict';

function main () {
  const barname = myBars[0].barname;
  console.log(barname);
  console.log(myBars[0].price);

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

        // bars markers & infowindow
        for (let i = 0; i < myBars.length; i++) {
          let contentString = myBars[i].barname;
          const infoWindow = new google.maps.InfoWindow(
            {content: contentString});
          const barsMarker = new google.maps.Marker({
            position: {
              lat: myBars[i].location.coordinates[0],
              lng: myBars[i].location.coordinates[1]
            },
            // icon: icon,
            map: map,
            label: myBars[i].price.toString() + '€'
          });

          infoWindow.setPosition({
            lat: myBars[i].location.coordinates[0],
            lng: myBars[i].location.coordinates[1]
          });
          barsMarker.addListener('click', () => {
            if (!barsMarker.open) {
              infoWindow.open(map, barsMarker);
              barsMarker.open = true;
            } else {
              infoWindow.close();
              barsMarker.open = false;
            }
            google.maps.event.addListener(map, 'click', () => {
              infoWindow.close();
              barsMarker.open = false;
            });
          });
        }

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
