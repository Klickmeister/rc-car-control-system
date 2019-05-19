var ball = document.querySelector('.ball');
var garden = document.querySelector('.garden');
var output = document.querySelector('.output');
var initial = document.querySelector('.initial');
var maxAcceleration = 30;
var maxSteering = 30;
var steering;
var acceleration;
var initinalSteering = 15;
var initinalAcceleration = 15;

var maxX = garden.clientWidth - ball.clientWidth;
var maxY = garden.clientHeight - ball.clientHeight;

function handleOrientation(event) {

  var x = event.gamma; // In degree in the range [-90,90]
  var y = event.beta;  // In degree in the range [-180,180]
  var z = event.alpha;
  
  steering = Math.round(y);
  acceleration = Math.round(x);
  test = Math.round(z);

  
  var currentSteering = steering -  initinalSteering;
  var currentAcceleration = Math.round(x) - initinalAcceleration;
  var currentTest  = test - initinalTest;

  if (Math.abs(currentSteering) >= maxSteering) {
    currentSteering = (currentSteering < 0 ? maxSteering*(-1) : maxSteering);
  }

  if (Math.abs(currentAcceleration) > maxAcceleration) {
    currentAcceleration = (currentAcceleration < 0 ? -maxAcceleration : maxAcceleration);
  }

  currentAcceleration = -currentAcceleration;

  output.innerHTML = "steering : " + currentSteering + "\n";
  output.innerHTML += "acceleration: " + currentAcceleration + "\n";
  output.innerHTML += "z: " + currentTest + "\n";

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
  initinalSteering = steering;
  initinalAcceleration = acceleration;
  initinalTest = test;
  initial.innerHTML = "initialSteering : " + steering + "\n";
  initial.innerHTML += "initialAcceleration: " + acceleration + "\n";
  initial.innerHTML += "initialTest: " + test + "\n";


}

window.addEventListener('deviceorientation', handleOrientation);