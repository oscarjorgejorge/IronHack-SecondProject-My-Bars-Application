'use strict';

function startMap () {
  const ironhackBCN = {
    lat: 41.3977381,
    lng: 2.190471916};
  const map = new google.maps.Map(
    document.getElementById('map'),
    {
      zoom: 15,
      center: ironhackBCN
    }
  );

  if (navigator.geolocation) {
    // Get current position
    // The permissions dialog will popup
    navigator.geolocation.getCurrentPosition(function (position) {
      // Create an object to match
      const center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      // Center the map in the position we got
      const myMarker = new google.maps.Marker({
        position: {
          lat: center.lat,
          lng: center.lng
        },
        map: map,
        title: "I'm here"
      });
    }, function () {
      // If something else goes wrong
      console.log('Error in the geolocation service.');
    });
  } else {
    // Browser says: Nah! I do not support this.
    // console.log('Browser does not support geolocation.');
    const myMarker = new google.maps.Marker({
      position: {
        lat: 41.3977381,
        lng: 2.190471916
      },
      map: map,
      title: "I'm here"
    });
  }
}

startMap();
