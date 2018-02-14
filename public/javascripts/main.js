'use strict';

function main () {
  const barname = myBars[0].barname;

  function initMap () {
    let myMarker;
    const mapOptions = {
      zoom: 16,
      center: {
        lat: 41.3977381,
        lng: 2.190471916}
    };
    // --- center the map on the current location of user (if doesnt fail)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        mapOptions.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude};
      });
    }
    const map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // Create a new market for the user location
    function createMyMarker () {
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

          myMarker = new google.maps.Marker({
            position: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            },
            icon: icon,
            map: map
          });

          map.setCenter(pos);
        });
      }
    };

    // --- to work on this :) <<-----------------------------------------------------------------------------------
    // setInterval(() => {
    //   createMyMarker();
    //   // destroy myMarker;
    // }, 5000);

    // --- lop to create markers for the bars location and infoWindow
    // --- create infoWindow with the content
    for (let i = 0; i < myBars.length; i++) {
      let contentString = myBars[i].barname;
      const infoWindow = new google.maps.InfoWindow(
        {content: contentString});

        // --- create markers for each bar
      const barsMarker = new google.maps.Marker({
        position: {
          lat: myBars[i].location.coordinates[0],
          lng: myBars[i].location.coordinates[1]
        },
        // --- icon: icon, place to change icon
        map: map,
        label: myBars[i].price.toString() + '€'
      });

      // --- bin each infowindow with each bar´s marker and add event listener to display and hide the infowindow
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
  }
  initMap();
}

window.onload = main;
