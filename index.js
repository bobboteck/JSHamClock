// Callsign
const currentCallSign = localStorage.getItem("callSign");
document.getElementById("displayCallSign").innerHTML = currentCallSign;
document.getElementById("callsignInput").value = currentCallSign;
// Locator
const locator = localStorage.getItem("locator");
document.getElementById("displayLocator").innerHTML = locator;
document.getElementById("locatorInput").value = locator;
// Latitude
const latitude = localStorage.getItem("latitude") === null ? 12.49 : localStorage.getItem("latitude");
document.getElementById("latitudeInput").value = latitude;
// Longitude - longitudeInput
const longitude = localStorage.getItem("longitude") === null ? 41.88 : localStorage.getItem("longitude");
document.getElementById("longitudeInput").value = longitude;


let map = L.map('mapContainer').setView([longitude, latitude], 2);
let Stamen_Terrain = L.tileLayer('https://tile.openstreetmap.de/{z}/{x}/{y}.png', 
{
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 10,
    ext: 'png'
}).addTo(map);
let myPosition = L.marker([longitude, latitude]).addTo(map);



let spotList = "<ul class='list-group'>";

fetch('https://api.pota.app/spot/activator')
.then(response => 
{
    return response.json();
})
.then(jsonData =>
{
    let index = 0;

    jsonData.forEach(spot =>
    {
        if(index < 5)
        {
            spotList += "<li class='list-group-item'>" + spot.activator + " Freq: " + spot.frequency + " [" + spot.mode + "] Ref: " + spot.reference + "</li>";
            index++;
        }
    });

    spotList += "</ul>";

    document.getElementById("potaSpot").innerHTML = spotList;
});


function saveStationSettings()
{
    // Callsign 
    let callSign = document.getElementById("callsignInput").value;
    localStorage.setItem("callSign", callSign);
    document.getElementById("displayCallSign").innerHTML = callSign;
    // Locator
    let locator = document.getElementById("locatorInput").value;
    localStorage.setItem("locator", locator);
    document.getElementById("displayLocator").innerHTML = locator;
}