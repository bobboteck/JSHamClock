const potaIcon = L.icon({ iconUrl: 'images/marker-pota.png', iconSize: [26,41], iconAnchor: [12,40], popupAnchor: [0,-30] });
const modeAll = ["FM","SSB","CW","FT4","FT8"];

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
// Longitude
const longitude = localStorage.getItem("longitude") === null ? 41.88 : localStorage.getItem("longitude");
document.getElementById("longitudeInput").value = longitude;
// POTA Interval
const potaInterval = localStorage.getItem("potaInterval") === null ? 3 : localStorage.getItem("potaInterval");
document.getElementById("potaInterval").value = potaInterval;
// POTA Mode Filter - get saved filte
const potaModeFilter = localStorage.getItem("potaModeFilter") === null ? "" : localStorage.getItem("potaModeFilter");
// POTA Mode Filter - check saved filter
modeAll.forEach(mode =>
{
    if(potaModeFilter.indexOf(mode) !== -1)
    {
        document.getElementById("mode"+mode).checked = true;
    }
});


// Map
let map = L.map('mapContainer').setView([longitude, latitude], 2);
let Stamen_Terrain = L.tileLayer('https://tile.openstreetmap.de/{z}/{x}/{y}.png', 
{
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 10,
    ext: 'png'
}).addTo(map);
let myPosition = L.marker([longitude, latitude]).addTo(map).bindPopup(currentCallSign);


updateClock();
updatePota(true);


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

function savePotaSettings()
{
    const currentPotaInterval = localStorage.getItem("potaInterval") === null ? 3 : localStorage.getItem("potaInterval");
    // Save timeout value of minutes refresh interval
    const potaIntToSave = document.getElementById("potaInterval").value;
    localStorage.setItem("potaInterval", potaIntToSave);
    // Save mode to be filtered on data received
    let modeToBeFilter = [];
    // Loop for possible filter
    modeAll.forEach(mode =>
    {
        if(document.getElementById("mode"+mode).checked)
        {
            modeToBeFilter.push(mode);
        }
    });
    // Save data on local storage
    localStorage.setItem("potaModeFilter", modeToBeFilter);

    if(currentPotaInterval !== potaIntToSave)
    {
        location.reload();
    }
}


function updatePota(setRefreshInterval = true)
{
    // POTA Spots
    let spotList = "<ul class='list-group'>";

    fetch('https://api.pota.app/spot/activator')
    .then(response => 
    {
        return response.json();
    })
    .then(jsonData =>
    {
        let index = 0;
        // Order data by spotId
        jsonData.sort((a, b) => b.spotId - a.spotId);
        // Filter on desired bands
        const potaSpotsModeFiltered = jsonData.filter((potaSpot) => potaSpot.mode !== "" && potaModeFilter.indexOf(potaSpot.mode) >= 0);
        console.log(potaSpotsModeFiltered);

        // Loop for each data in the json
        potaSpotsModeFiltered.forEach(spot => 
        {
            if(index < 5)
            {
                spotList += "<li class='list-group-item'>" + spot.activator + " Freq: " + spot.frequency + " [" + spot.mode + "] Ref: " + spot.reference + "</li>";
                // Add POTA marker on map
                L.marker([spot.latitude, spot.longitude], {icon: potaIcon}).addTo(map).bindPopup(spot.activator);

                index++;
            }
        });

        spotList += "</ul>";

        document.getElementById("potaSpot").innerHTML = spotList;
    });

    console.log("POTA Updated:", new Date());

    if(setRefreshInterval)
    {
        setTimeout(updatePota, potaInterval * 60000);
    }
}


function updateClock()
{
    const localDate = new Date();
    const nHours = localDate.getHours();
    const nMinutes = localDate.getMinutes();
    const nSeconds = localDate.getSeconds();
    const sMinutes = nMinutes < 10 ? "0" + nMinutes : nMinutes;
    const sSeconds = nSeconds < 10 ? "0" + nSeconds : nSeconds;

    const nUtcHours = localDate.getUTCHours();

    document.getElementById('localTime').innerHTML =  nHours + ":" + sMinutes + ":" + sSeconds;
    document.getElementById('utcTime').innerHTML =  nUtcHours + ":" + sMinutes + ":" + sSeconds;
    
    setTimeout(updateClock, 1000);
}