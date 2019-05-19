const Gyro = {
  init: () => {
    if ('DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', deviceOrientationHandler, false);
      console.log("ok");
    } else {
      document.getElementById('logoContainer').innerText = 'Device Orientation API not supported.';
    }
    
    function deviceOrientationHandler (eventData) {
      var tiltLR = eventData.gamma;
      var tiltFB = eventData.beta;
      var dir = eventData.alpha;
      console.log("asas");
      document.getElementById("doTiltLR").innerHTML = Math.round(tiltLR);
      document.getElementById("doTiltFB").innerHTML = Math.round(tiltFB);
      document.getElementById("doDirection").innerHTML = Math.round(dir);
    
      var logo = document.getElementById("imgLogo");
      logo.style.webkitTransform = "rotate(" + tiltLR + "deg) rotate3d(1,0,0, " + (tiltFB * -1) + "deg)";
      logo.style.MozTransform = "rotate(" + tiltLR + "deg)";
      logo.style.transform = "rotate(" + tiltLR + "deg) rotate3d(1,0,0, " + (tiltFB * -1) + "deg)";
    }

    var ball = document.querySelector('.ball');
    var garden = document.querySelector('.garden');
    var output = document.querySelector('.output');

    if (window.DeviceOrientationEvent) {
      output.innerHTML = 'it works!';
    }
    var maxX = garden.clientWidth - ball.clientWidth;
    var maxY = garden.clientHeight - ball.clientHeight;



    function handleMotionEvent(event) {

    output.innerHTML = event;

    var x = event.accelerationIncludingGravity.x;
    var y = event.accelerationIncludingGravity.y;
    var z = event.accelerationIncludingGravity.z;

    output.innerHTML = x;

    // Do something awesome.
    }

    window.addEventListener("devicemotion", handleMotionEvent, true);
  }
}