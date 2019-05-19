const Gyro = {
  init: () => {
    var ball = document.querySelector('.ball');
    var garden = document.querySelector('.garden');
    var output = document.querySelector('.output');
    var initial = document.querySelector('.initial');
    var status = document.querySelector('.status');
    var maxAcceleration = 6;
    var maxSteering = 6;
    var steering = 0;
    var test = 0;
    var acceleration = 0;
    var initinalSteering = 15;
    var initinalAcceleration = 15;
    var initinalTest = 0;
    var currentInterval = null;
    var currentSteering = 0;
    var currentAcceleration = 0;
    var currentZ = 0;


    var maxX = garden.clientWidth - ball.clientWidth;
    var maxY = garden.clientHeight - ball.clientHeight;

    var isInitialized = false;

    function handleOrientation(event) {

      var x = event.gamma * 0.25; // In degree in the range [-90,90]
      var y = event.beta * 0.25;  // In degree in the range [-180,180]
      var z = event.alpha;

      steering = Math.round(y);
      acceleration = Math.round(x);
      test = Math.round(z);

      currentSteering = steering - initinalSteering;
      currentAcceleration = Math.round(x) - initinalAcceleration;
      currentZ = test - initinalTest;

      if (Math.abs(currentSteering) >= maxSteering) {
        currentSteering = (currentSteering < 0 ? maxSteering * (-1) : maxSteering);
      }

      if (Math.abs(currentAcceleration) > maxAcceleration) {
        currentAcceleration = (currentAcceleration < 0 ? -maxAcceleration : maxAcceleration);
      }

      currentAcceleration = -currentAcceleration;

      output.innerHTML = "steering : " + currentSteering + "\n";
      output.innerHTML += "acceleration: " + currentAcceleration + "\n";
      output.innerHTML += "z: " + currentZ + "\n";

      // Because we don't want to have the device upside down
      // We constrain the x value to the range [-90,90]
      if (currentSteering > 90) { currentSteering = 90 };
      if (currentSteering < -90) { currentSteering = -90 };

      // To make computation easier we shift the range of 
      // x and y to [0,180]
      currentSteering += 90;
      currentAcceleration += 90;

      // 10 is half the size of the ball
      // It center the positioning point to the center of the ball
      ball.style.left = (maxX * currentSteering / 180 - 10) + "px";
      ball.style.top = (maxY * currentAcceleration / 180 - 10) + "px";
    }

    var initButton = document.querySelector('[data-init]');
    initButton.addEventListener('click', handleInitClick);
    function handleInitClick() {

      if (isInitialized) {
        initButton.innerHTML = 'START'
        window.removeEventListener('deviceorientation', handleOrientation);
        isInitialized = false;
        postAjax('https://192.168.11.117:3000/rc', { "steering": 0, "speed": 0 }, function (data) { console.log(data); });

        clearInterval(currentInterval);
      }
      else {
        initButton.innerHTML = 'STOP';
        window.addEventListener('deviceorientation', handleOrientation);

        initinalSteering = steering;
        initinalAcceleration = acceleration;
        initinalTest = test;
        initial.innerHTML = "initialSteering : " + steering + "\n";
        initial.innerHTML += "initialAcceleration: " + acceleration + "\n";
        initial.innerHTML += "initialZ: " + test + "\n";

        window.addEventListener('deviceorientation', handleOrientation);
        isInitialized = true;
        currentInterval = setInterval(() => {
          
          postAjax('https://192.168.11.117:3000/rc', { "steering": currentSteering, "speed": currentAcceleration }, function (data) {status.innerHTML(data); });

        }, 300);
      }
    }

    function postAjax(url, data, success) {
      var xhr = new XMLHttpRequest();
      //Send the proper header information along with the request
      xhr.open("POST", url, true);
      xhr.setRequestHeader('Access-Control-Allow-Origin','*');
      xhr.setRequestHeader('Content-type','application/json');
      xhr.setRequestHeader('Access-Control-Allow-Methods','POST');      
      console.log(xhr);
      xhr.onreadystatechange = function() { // Call a function when the state changes.
          if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            console.log(this);
              // Request finished. Do processing here.
          }
      }
      xhr.send(data);
    }
  }
}

