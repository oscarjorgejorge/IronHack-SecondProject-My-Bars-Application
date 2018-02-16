'use strict';

function main () {
  function initMap () {
    let myMarker;
    const mapOptions = {
      zoom: 17,
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
        map.setCenter(mapOptions.center);
      });
    }
    const map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // Create a new marker for the user location
    function createMyMarker () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          let icon = {
            url: '../images/blueicon.png',
            scaledSize: new google.maps.Size(40, 40)
          };

          myMarker = new google.maps.Marker({
            position: pos,
            icon: icon,
            map: map
          });
          // --- map.setCenter(pos); center the map on the current location marker
        });
      }
    };

    // --- pending, update current location :) <<-----------------------------------------------------------------------------------
    // setInterval(() => {
    //   createMyMarker();
    //   // destroy myMarker;
    // }, 5000);

    createMyMarker();
    showMarkers(map);
  }
  initMap();

  function showMarkers (map) {
    for (let i = 0; i < myBars.length; i++) {
      const newMarker = createNewMarker(myBars[i], map);
      const contentString = getContentString(myBars[i], i);
      const infoWindow = getInforWindow(myBars[i], contentString);
      addEventListenerToMarker(map, newMarker, infoWindow, i);
    }
  }

  function addEventListenerToMarker (map, marker, infoWindow, idx) {
    const infoDivs = document.getElementById('info');
    let eventListenerAdded = false;
    marker.addListener('click', () => {
      if (!marker.open) {
        infoWindow.open(map, marker);
        marker.open = true;
      } else {
        infoWindow.close();
        marker.open = false;
      }
      if (!eventListenerAdded) {
        eventListenerAdded = true;
        const btnInfo = document.getElementById('btn-information-' + idx);
        btnInfo.addEventListener('click', () => {
          infoWindow.close();
          marker.open = false;
          appendInfoDiv(infoDivs, myBars[idx], idx);
        });
      }
    });
  }

  function appendInfoDiv (parent, bar, idx) {
    // check if infodiv exist
    if (document.getElementById('info').childElementCount < 3) {
      if (!document.getElementById('delete-button-bar-info-' + idx)) {
        const infodiv = document.createElement('div');
        const barInfoInnerHtml = getInfoElementString(bar, idx);

        infodiv.classList.add('bar-info');
        infodiv.innerHTML = barInfoInnerHtml;

        const destroyInfo = () => {
          infodiv.remove();
        };
        parent.appendChild(infodiv);
        const deleteBarInfo = document.getElementById('delete-button-bar-info-' + idx);
        deleteBarInfo.addEventListener('click', destroyInfo);
      }
    }
  }

  function getInfoElementString (bar, idx) {
    return '<div class="characteristics"><ul><li><span style="font-weight:bold">Bar´s Name : </span>' + bar.barname +
    '</li><li><span style="font-weight:bold">Price Beer 50cl : </span>' + bar.price + '</li><li><span style="font-weight:bold">Address : </span>' +
    bar.address + '</li><li><span style="font-weight:bold">hours : </span>' + bar.hours + '</li></ul><p style="font-weight:bold">Description :</p><p>' +
    bar.description + '</p></div><div class="photo-bar-map">photo<button class="delete-button-bar-info" id="delete-button-bar-info-' + idx + '">X</button></div>';
  }

  function getContentString (bar, idx) {
    return '<p style="font-weight: bold;">' + bar.barname + '</p>' + bar.address +
    '</br>' + bar.hours + '</br></br><button id="btn-information-' + idx + '">See more details';
  }

  function getInforWindow (bar, content) {
    const newWindow = new google.maps.InfoWindow({content: content});
    newWindow.setPosition({
      lat: bar.location.coordinates[0],
      lng: bar.location.coordinates[1]
    });
    return newWindow;
  }

  function createNewMarker (bar, map) {
    let icon = {
      url: '../images/coin-brown-border.png',
      scaledSize: new google.maps.Size(55, 55)
    };
    const barMarker = new google.maps.Marker({

      position: {
        lat: bar.location.coordinates[0],
        lng: bar.location.coordinates[1]
      },
      icon: icon,
      map: map,
      label: {
        text: bar.price.toString() + '€',
        color: '#966A39',
        fontSize: '22px'
      }
    });
    return barMarker;
  }
}

window.onload = main;
