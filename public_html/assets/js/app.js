var loadingAircrafts = false;
var map;
var aircraftMarker = {};
var activeAircrafts = {};
var aircraftLastSaw = {};
var settedTime = null;

var aircraftIcon = L.icon({
    iconUrl: 'assets/images/aircraft.png',

    iconSize:     [16, 16], // size of the icon
    shadowSize:   [16, 16], // size of the shadow
    iconAnchor:   [8, 8], // point of the icon which will correspond to marker's location
    shadowAnchor: [64, 64],  // the same for the shadow
    popupAnchor:  [0, -8] // point from which the popup should open relative to the iconAnchor
});

function AddMap(){
    map = L.map('map').setView([47.517141, 9.891260], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map); 
    L.marker(['47.517141', '9.891260']).addTo(map);
}

function SetTimeDatePicker(){
    SetCurrentTimeToPicker();
    setInterval(SetCurrentTimeToPicker, 1000);
    $("#datetimepicker .datetimepicker").change(function(){
        settedTime = $("#datetimepicker .datetimepicker").val();
        ResetAircrafts();
        SetOwnAircrafts();
    });
    $("#datetimepicker .resetbutton").click(function(){
        settedTime = null;
        ResetAircrafts();
        SetOwnAircrafts();
    });
}

function ResetAircrafts(){
    $.each(aircraftMarker, function( index, value ) {
        map.removeLayer(value);
        delete aircraftMarker[index];
    });
    aircraftLastSaw = {};
    activeAircrafts = [];    
    aircraftMarker = {};
}

function SetCurrentTimeToPicker(){
    if(settedTime === null){
        var now = new Date();
        var dd = now.getDate();
        var MM = now.getMonth()+1; 
        var yyyy = now.getFullYear();
        var hh = now.getHours();
        var mm = now.getMinutes();
        var ss = now.getSeconds();
        if (dd<10) { dd='0'+dd; }
        if (MM<10) { MM='0'+MM; }
        if (mm<10) { mm='0'+mm; }
        if (ss<10) { ss='0'+ss; }
        if (hh<10) { hh='0'+hh; }
        $("#datetimepicker .datetimepicker").val(yyyy+"-"+MM+"-"+dd+"T"+hh+":"+mm+":"+ss);
    }
}

function SetOwnAircrafts(){
    if(!loadingAircrafts){
        activeAircrafts = [];
        var time = "";
        if(settedTime !== null){
            time = "?time="+(Date.parse(settedTime)/1000);
        }
        $.getJSON( "proxy.php?p=/api/states/own"+time, function( data ) {
           if(data.states !== null && data.states.length > 0){
               for (var i = 0; i < data.states.length; i++) {
                    activeAircrafts[activeAircrafts.length] = data.states[i][0];
                    aircraftLastSaw[data.states[i][0]] = Date.now();
                    SetAircraft(data.states[i]);
                }
            }
            RemoveAircrafts();
        });
    }
}

function SetAircraft(aircraft){
    if(aircraft[5] !== null && aircraft[6] !== null){
        var icao24 = aircraft[0];
        if(aircraftMarker[icao24] === undefined){
            aircraftMarker[icao24] = L.marker(
                    [aircraft[6], aircraft[5]], 
                    {icon: aircraftIcon}
                    )
                    .addTo(map)
                    .bindPopup(GetPopupText(aircraft));
        } else{
            var newLatLng = new L.LatLng(aircraft[6], aircraft[5]);
            aircraftMarker[icao24].setLatLng(newLatLng); 
            aircraftMarker[icao24]._popup.setContent(GetPopupText(aircraft));
        }
        aircraftMarker[icao24].setRotationAngle(aircraft[10] - 45);
    }     
}

function RemoveAircrafts(){
    $.each(aircraftMarker, function( index, value ) {
       if(activeAircrafts.indexOf(index) === -1 && aircraftLastSaw[index] <= (Date.now() - 20000)){
            map.removeLayer(value);
            delete aircraftMarker[index];
       }
    });
}

function GetPopupText(aircraft){
    var text = '<b><a href="https://www.flightradar24.com/'+aircraft[1]+'" target="_blank">'+aircraft[1]+'</a></b><br>';
    text += 'Alt: ' + aircraft[13] + " m<br>";
    text += 'Speed: ' + Math.round(aircraft[9] * 3.6) + " km/h<br>";
    text += 'VR: ' + Math.round(aircraft[11] * 3.6) + " km/h<br>";
    return text;
}