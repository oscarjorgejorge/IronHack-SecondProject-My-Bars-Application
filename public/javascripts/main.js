'use strict';

function main () {
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
            scaledSize: new google.maps.Size(25, 25)
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

    createMyMarker();

    // --- pending, update current location :) <<-----------------------------------------------------------------------------------
    // setInterval(() => {
    //   createMyMarker();
    //   // destroy myMarker;
    // }, 5000);

    // --- lop to create markers for the bars location and infoWindow
    // --- create infoWindow with the content
    for (let i = 0; i < myBars.length; i++) {
      let contentString = '<p style="font-weight: bold;">' + myBars[i].barname + '</p>' + myBars[i].address +
      '</br>' + myBars[i].hours + '</br></br><button id="btn-information">See more details';
      const infoWindow = new google.maps.InfoWindow(
        {content: contentString});

        // --- create markers for each bar
      let icon = {
        url: '../images/coin-brown-border.png',
        scaledSize: new google.maps.Size(31, 31)
      };
      const barsMarker = new google.maps.Marker({

        position: {
          lat: myBars[i].location.coordinates[0],
          lng: myBars[i].location.coordinates[1]
        },
        icon: icon,
        map: map,
        label: {
          text: myBars[i].price.toString() + '€',
          color: '#966A39',
          fontSize: '12px'
        }
      });

      // --- bind each infowindow with each bar´s marker and add event listener to display and hide the infowindow
      infoWindow.setPosition({
        lat: myBars[i].location.coordinates[0],
        lng: myBars[i].location.coordinates[1]
      });
      barsMarker.addListener('click', () => {
        if (!barsMarker.open) {
          infoWindow.open(map, barsMarker);
          barsMarker.open = true;

          // --- Create bar information under the map
          const infodivs = document.getElementById('info');
          var btninfo = document.getElementById('btn-information');

          const displayBarInfo = () => {
            infodivs.classList.add('bar-info-container');
            const infodiv = document.createElement('div');
            infodivs.appendChild(infodiv);
            infodiv.classList.add('bar-info');
            let barInfoInnerHtml = '<div class="characteristics"><ul><li><span style="font-weight:bold">Bar´s Name : </span>' + myBars[i].barname +
            '</li><li><span style="font-weight:bold">Price Beer 50cl : </span>' + myBars[i].price + '</li><li><span style="font-weight:bold">Address : </span>' +
            myBars[i].address + '</li><li><span style="font-weight:bold">hours : </span>' + myBars[i].hours + '</li></ul><p style="font-weight:bold">Description :</p><p>' +
            myBars[i].description + '</p></div><div class="photo-bar-map">photo<button class="delete-button-bar-info">X</button></div>';
            infodiv.innerHTML = barInfoInnerHtml;
            const deleteBarInfo = document.getElementsByClassName('delete-button-bar-info')[0];

            const destroyInfo = () => {
              deleteBarInfo.removeEventListener('click', destroyInfo);
              infodiv.remove();
            };
            deleteBarInfo.addEventListener('click', destroyInfo);
            infoWindow.close();
            barsMarker.open = false;
          };

          btninfo.removeEventListener('click', displayBarInfo);
          btninfo.addEventListener('click', displayBarInfo);
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
