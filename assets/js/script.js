var ball = document.querySelector('.ball');
var garden = document.querySelector('.garden');
var output = document.querySelector('.output');
var initial = document.querySelector('.initial');
var maxAcceleration = 30;
var maxSteering = 30;
var steering;
var acceleration;
var initinalSteering;
var initinalAcceleration;

var maxX = garden.clientWidth - ball.clientWidth;
var maxY = garden.clientHeight - ball.clientHeight;

function handleOrientation(event) {

  var x = event.beta;  // In degree in the range [-180,180]
  var y = event.gamma; // In degree in the range [-90,90]
  
  
  steering = Math.round(x);
  acceleration = Math.round(y);

  if (Math.abs(steering) >= maxSteering) {
    steering = (steering < 0 ? maxSteering*(-1) : maxSteering);
  }

  if (Math.abs(acceleration) > maxAcceleration) {
    acceleration = (acceleration < 0 ? -maxAcceleration : maxAcceleration);
  }

  output.innerHTML = "steering : " + steering + "\n";
  output.innerHTML += "acceleration: " + acceleration + "\n";

  // Because we don't want to have the device upside down
  // We constrain the x value to the range [-90,90]
  if (x > 90) { x = 90 };
  if (x < -90) { x = -90 };

  // To make computation easier we shift the range of 
  // x and y to [0,180]
  x += 90;
  y += 90;

  // 10 is half the size of the ball
  // It center the positioning point to the center of the ball
  ball.style.top = (maxX * x / 180 - 10) + "px";
  ball.style.left = (maxY * y / 180 - 10) + "px";
}

var initButton = document.querySelector('[data-start]');
initButton.addEventListener('click', handleInitClick);

function handleInitClick() {
  initinalSteering = steering;
  initinalAcceleration = acceleration;
  initial.innerHTML = "steering : " + steering + "\n";
  initial.innerHTML += "acceleration: " + acceleration + "\n";

}
console.log(initButton);

window.addEventListener('deviceorientation', handleOrientation);