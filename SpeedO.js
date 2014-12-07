
//**********************************************************************************
//  General Global Variables (I'm lazy and hate passing variables - you can change it)
//
var speed = 0;
var direction = 0;
var direction2 = 0;
var directionDiff = 0;
var head;
var myPosition;
var lat1 = 0.0;
var lon1 = 0.0;
var lon2 = 0.0;
var lat2 = 0.0;
var locCheckTime1 = 0;
var locCheckTime2 = 0;
var timeDiffinSecs = 0;
var d;

var x = document.getElementById("SpeedReadoutMPH");
var y = document.getElementById("SpeedReadoutKPH");
var z = document.getElementById("Direction");
var d = document.getElementById("arrow-dir");
//
//**********************************************************************************



//**********************************************************************************
// I do some base speed calculations from distance equations further down.
// Basically, just converting distance to KPH and MPH
function startSpeed() {

    speedKPHcalc = speed * 3600; // convert speed to km per hour
    speedMPHcalc = ((dist * 1.60934)/timeDiffinSecs) * 1000; // conver distance to miles and find speed in mph

    // Here, to make the bar-graphs on the UI work properly for a potential of 200 KPH or MPH, I have to divide
    // the total height of the screen into 100 parts.
    // I therefor take the speed and divide by 2 so it only takes up half the height, thus I can fit twice as much
    // speed indicator over the height of the screen.
    //
    // This also makes it so that it is generic to any device height (phone, tablet, etc).
    
    var speedMPH1 = (speedMPHcalc / 2);
    var speedKPH1 = (speedKPHcalc / 2);
    
    
    // Here I'm just taking the calculated speed for the bar graph, and limiting it to 2 decimal places for display
    // on the screen.
    
    speedMPH = speedMPH1.toFixed(2);
    speedKPH = speedKPH1.toFixed(2);
    
    
    // Here I just say if the KPH speed is over 200, then just max at 200.  This keeps the CSS mechanics of the bar
    // graph from doing odd things on the screen if it happens to go over the max height (100%) of the screen or 200 KPH.
    
    if (speedKPH > 200) {
        speedKPH = 200;
    }

    console.log("Inside Function now.");

    
    // Here i'm setting each element in the UI for the bar grpahs to a variable.
    
    var square1 = document.getElementById("mph");
    var square2 = document.getElementById("kph");
    var squareTop1 = document.getElementById("topperMPH");
    var squareTop2 = document.getElementById("topperKPH");
    

    
    // here I adjust the style height of each bar graph to the appropriate view height (vh) of the associated speed.
    // I also set the topper style height (which pushes the colorized bar graph to the bottom of the screen to
    // be 100 minux the speed based view height (vh).  This is how I force the speed bar graph to grow upward from
    // the bottom of the view.
    
    squareTop1.style.height = (100 - speedMPH) + "vh";
    square1.style.height = speedMPH + "vh";

    squareTop2.style.height = (100 - speedKPH) + "vh";
    square2.style.height = speedKPH + "vh";
    
    
    // Nex I display the speed fo rMPH and KPH on the screen, with lat and long below them.

    x.innerHTML = speedMPH + " MPH";
    y.innerHTML = speedKPH + " KPH<br />"+ lat2 + "<br />"+ lon2;
    

    
    // Here we set the direction of travel.  We basically get a degree representation of the heading, and set
    // generalized ranges for each of the 8 possible directions.
    
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
    
    
    // once set, we display the heading on the screen in its element.

    z.innerHTML = head;
    
    
    // in order to make our needle move appropriately, we must transform it.
    // We transform it the appropriate number of degrees by knowing the previous heading
    // and subtracting the current heading from it.
    
    directionDiff = direction - direction2;
    console.log("Degrees: " + direction);
    console.log(directionDiff);
    d.style.webkitTransform = "rotate(" + (direction2 * (-1)) + "deg)";
    d.style.webkitTransform = "rotate(" + direction + "deg)";

}
//
//**********************************************************************************



//**********************************************************************************
// The function below is where we actually start getting the geolocation inforamtion.
// we set a varialbe myPosition to the watchPosition call, so we can cancel it later
// if we want to.

function genLocationData() {
    console.log("at gen location ----------------------------------");
      if (navigator.geolocation) {
          console.log("Geolocation is true ----------------------------------");
        
        myPosition = navigator.geolocation.watchPosition(showPosition, error_position);
     } else {
         console.log("Geolocation is not supported by this browser.");
         x.innerHTML = "Geolocation is not supported by this browser.";
     }
}
//
//**********************************************************************************




//**********************************************************************************
// Here we handle and display any error information if the watchPosition call fails.

function error_position(errorcode) {
    console.log(errorcode);
    // console.log("There was an error."+ errorcode.code);
}
//
//**********************************************************************************




//**********************************************************************************
// This function is where we actually get the Longitude and Latitude information from our
// geolocation call.
function showPosition(position) {
    console.log("At showPosition now.");
    
    // I set lat1 and lon1 to be the previous coordinates.
    
    lat1 = lat2;
    lon1 = lon2;
    
    
    // I then pull the current coordinates into lat2 and lon2.
    
    lat2 = position.coords.latitude;
    lon2 = position.coords.longitude;
    
    
    // I need to find the distance between the previous and current coordinates, so I call
    // a function that will perform the calculation.
    
    findDistance();
    
    
    // From the distance calculation, I return the distance value and come back to this
    // function right where I left off, so now I'll use the distance information to calculate
    // a speed in kilometers per second
    //
    // first I will get the time.  This is given by a javascript function in milliseconds since
    // Jan 1, 1970 at 00:00 hours.
    
    var dateToday = new Date();
    console.log("date is: " + dateToday);
    
    
    // I set set the previous time variable.
    
    locCheckTime1 = locCheckTime2;
    
    
    // I then get the current time variable.
    
    locCheckTime2 = dateToday.getTime();
    console.log("time is: " + locCheckTime2);
    
    
    // do some simple subtraction to get the time difference then divide by 1000 to get the
    // time difference in seconds
    
    timeDiffinSecs = (locCheckTime2 - locCheckTime1)/1000;
    console.log(" ");
    console.log(timeDiffinSecs);
    console.log(" ");
    
    speed = dist/timeDiffinSecs; //gives speed in kilometers per second km/s

    
    console.log("lat2 = "+ lat2);
    console.log("lon2 = "+ lon2);
    console.log("dist = "+ dist);
    console.log("speed = "+ speed);
    
    
    
    // I use the two commented out statements below to test my UI.  Basically you have to
    // comment out the speed above, and a few other sections, then uncomment these two lines.
    
    // speed = Math.floor((Math.random() * 59) + 1);
    // direction = Math.floor((Math.random() * 365) + 1);
    
    
    // Now we call the function above to get our UI to display what we need.

    startSpeed();
}
//
//**********************************************************************************




//**********************************************************************************
// variables for determining distance / speed
//
function findDistance() {
    var R = 6371; // Radius of the Earth in km
    var phi1 = lat1.toRadians(); // latitude in Radians
    var phi2 = lat2.toRadians(); // longitude in Radians
    var changeinphi = (lat2-lat1).toRadians(); // latitude in Radians
    var changeinlambda = (lon2-lon1).toRadians(); // longitude in Radians

    
    // a little trigonometry

    var a = Math.sin(changeinphi/2) * Math.sin(changeinphi/2) + Math.cos(phi1) * Math.cos(phi2) * Math.sin(changeinlambda/2) * Math.sin(changeinlambda/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    dist = R * c; // distance between my current position and last position in km.
}
//
//**********************************************************************************



//**********************************************************************************
// Here we tell the browser that when it unloads (is closed) it should stop
// watching my position

window.onbeforeunload = function() {
    navigator.geolocation.clearwatch(myPosition);
}
//
//**********************************************************************************




//**********************************************************************************
// Here we tell the browser to start our location tracking when the page loads

window.onload = function() {
    console.log("load complete ----------------------------------");
    genLocationData();
}
//
//**********************************************************************************




//**********************************************************************************
// This function is what is called in order to turn our lat1, lat2, lon1,
// and lon2 into Radians

if (typeof(Number.prototype.toRadians) === "undefined") {
    Number.prototype.toRadians = function() {
        return this * Math.PI / 180;
    }
}
//
//**********************************************************************************