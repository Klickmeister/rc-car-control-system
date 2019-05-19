import time
import RPi.GPIO as GPIO
import sys

# Control the servo
def control_servo(servo_number, value):
    if value < 0: 
        value = 0
    elif value > 15:
        value = 15
    
    # range 1- 15
    servos[servo_number].ChangeDutyCycle(value)
    time.sleep(0.1)

    servos[servo_number].stop()

    return

# MAIN
GPIO.setmode(GPIO.BCM)

servo_pins = [12, 13]
servos = []

for pin in servo_pins:
    GPIO.setup(pin, GPIO.OUT)
    p = GPIO.PWM(pin, 50) # hz value
    p.start(0)
    servos.append(p)

# todo: check for input vals
speed = int(sys.argv[1])
steering = int(sys.argv[2])

try:

    if speed:
        control_servo(0, speed);

    if steering:
        control_servo(1, steering);

    GPIO.cleanup()

except KeyboardInterrupt:
    pass
    p.stop()
    GPIO.cleanup()