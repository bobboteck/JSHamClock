const currentCallSign = localStorage.getItem("callSign");
document.getElementById("displyCallSign").innerHTML = currentCallSign;
//callsignInput
document.getElementById("callsignInput").value = currentCallSign;


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


function saveStatioSettings()
{
    let callSign = document.getElementById("callsignInput").value;
    localStorage.setItem("callSign", callSign);
    document.getElementById("displyCallSign").innerHTML = callSign;
}