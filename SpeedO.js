var speed = 0;
var direction = 0;
var direction2 = 0;
var directionDiff = 0;
var head;

    var x = document.getElementById("SpeedReadoutMPH");
    var y = document.getElementById("SpeedReadoutKPH");
    var z = document.getElementById("Direction");
    var d = document.getElementById("arrow-dir");

function startSpeed() {


    var speedMPHcalc = ((speed / 1609.34) * 3600).toFixed(1);
    var speedKPHcalc = ((speed / 1000) * 3600).toFixed(1);

    var speedMPH = speedMPHcalc / 2;
    var speedKPH = speedKPHcalc / 2;

    if (speedKPH > 200) {
        speedKPH = 200;
    }

    console.log("Inside Function now.");

    var square1 = document.getElementById("mph");
    var square2 = document.getElementById("kph");
    var squareTop1 = document.getElementById("topperMPH");
    var squareTop2 = document.getElementById("topperKPH");
    

    squareTop1.style.height = (100 - speedMPH) + "vh";
    square1.style.height = speedMPH + "vh";

    squareTop2.style.height = (100 - speedKPH) + "vh";
    square2.style.height = speedKPH + "vh";

    x.innerHTML = speedMPHcalc + " MPH";
    y.innerHTML = speedKPHcalc + " KPH";

    if (direction < 6) {
        head = "N";
    }

    if ((direction > 5) && (direction < 86)) {
        head = "NE";
    }

    if ((direction > 85) && (direction < 96)) {
        head = "E";
    }

    if ((direction > 95) && (direction < 176)) {
        head = "SE";
    }

    if ((direction > 175) && (direction < 186)) {
        head = "S";
    }

    if ((direction > 185) && (direction < 266)) {
        head = "SW";
    }

    if ((direction > 265) && (direction < 276)) {
        head = "W";
    }

    if ((direction > 275) && (direction < 356)) {
        head = "NW";
    }

    if (direction > 355) {
        head = "N";
    }

    z.innerHTML = head;
    directionDiff = direction - direction2;
    console.log("Degrees: " + direction);
    console.log(directionDiff);
    d.style.webkitTransform = "rotate(" + (direction2 * (-1)) + "deg)";
    d.style.webkitTransform = "rotate(" + direction + "deg)";

    timerForAction();

}

function onLoad() {
    document.addEventListener("deviceready", genLocationData, false);
}

function genLocationData() {
      if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(showPosition);
     } else {
         x.innerHTML = "Geolocation is not supported by this browser.";
     }

    showPosition();
}

function showPosition(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    speed = position.coords.speed;
    direction2 = direction;
    direction = position.coords.heading
    
    // speed = Math.floor((Math.random() * 59) + 1);
    
    // direction = Math.floor((Math.random() * 365) + 1);

    startSpeed();
}

function timerForAction() {
    setTimeout(function(){genLocationData()}, 500);
}