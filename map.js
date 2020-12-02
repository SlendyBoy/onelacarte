//displays content (usually text or images) in a popup window above the map, at a given location
var infoWindow = new google.maps.InfoWindow();

//customs markers
var customIcons = {
    restaurant: {
        icon: './assets/icons/100-map-icons/restaurants.png'
    },
    asso: {
        icon: './assets/icons/100-map-icons/education.png'
    }
};
//groups of markers (refer to markers type)
var markerGroups = {
    "restaurant": [],
    "asso":[]
};

//Create the map
function load() {
    //Initialize the map in the element with id="map"
    var map = new google.maps.Map(document.getElementById("map"), {
        center: new google.maps.LatLng(45.75708692337648, 4.858654569844329),
        zoom: 12
    });

    //download data from file
    //markers-list.php if markers are stored in DB
    downloadUrl("markers-list.xml", function (data) {
        var xml = data.responseXML;
        var markers = xml.documentElement.getElementsByTagName("marker");
        //get the attributes for each marker and create it
        for (var i = 0; i < markers.length; i++) {
            var name = markers[i].getAttribute("name");
            var description = markers[i].getAttribute("description");
            var address = markers[i].getAttribute("address");
            var type = markers[i].getAttribute("type");
            var image = markers[i].getAttribute("image");

            var point = new google.maps.LatLng(
            parseFloat(markers[i].getAttribute("lat")),
            parseFloat(markers[i].getAttribute("lng")));

            createMarker(point, name, description, address, type, image, map);

        }
    });
}

//Create the markers
function createMarker(point, name, description, address, type, image, map) {
    var icon = customIcons[type] || {};
    var marker = new google.maps.Marker({
        map: map,
        position: point,
        icon: icon.icon,
        type: type
    });
    if (!markerGroups[type]) markerGroups[type] = [];
    //push the marker in the corresponding type group
    markerGroups[type].push(marker);
    //Content for the infoWindow
    var html = "<div id='infoflex'><div id='imgFlex'><img class='info' src='./assets/images/"+ image +"' alt=''></div><div id='txtFlex'><p><b>" + name + "</b></p> <p>" + description + "</p> <p>"+ address +"</p></div></div>";
    bindInfoWindow(marker, map, infoWindow, html);
    return marker;
}

//Show or hide the markers in the group
function toggleGroup(type) {
    for (var i = 0; i < markerGroups[type].length; i++) {
        var marker = markerGroups[type][i];
        if (!marker.getVisible()) {
            marker.setVisible(true);
        } else {
            marker.setVisible(false);
        }
    }
}

//Create the infoWindow and display it on click
function bindInfoWindow(marker, map, infoWindow, html) {
    google.maps.event.addListener(marker, 'click', function () {
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
    });
}

//explicit function name
function downloadUrl(url, callback) {
    var request = window.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest();

    request.onreadystatechange = function () {
        if (request.readyState == 4) {
            request.onreadystatechange = doNothing;
            callback(request, request.status);
        }
    };
    request.open('GET', url, true);
    request.send(null);
}
//yes
function doNothing() {}

//When the window is loaded, execute the load() function, creating the map
google.maps.event.addDomListener(window, 'load', load);
