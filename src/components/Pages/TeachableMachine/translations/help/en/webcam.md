Use your computer's webcam or the senseBox Eye camera to capture images for training your model.

# Webcam

Grant the browser window the necessary permissions and make sure no other application is currently using the webcam.

# senseBox Eye Camera

This feature is not available in all browsers (e.g. not in Firefox). First connect the Eye via USB to your computer, then select the Eye's port in the browser (on Linux or macOS the ports are often called "ttyACM0", on Windows "COM3"). If you have already loaded the required image capture sketch onto the Eye, you should now see the camera image of the Eye.

# Why is the camera image black-and-white and pixelated?

The senseBox Eye has far less processing power and memory than a standard computer or mobile phone. To ensure we can still run the trained model on the Eye, we have converted the camera image to black and white (instead of red-green-blue) and reduced it to 96x96 pixels. This significantly reduces the load on the processor and memory.
