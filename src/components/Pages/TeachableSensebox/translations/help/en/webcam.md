Use a webcam, smartphone camera or the senseBox Eye camera to capture images for training your model.

Make sure no other application or browser tab is currently using the camera.

# senseBox Eye Camera

This feature is not available in all browsers (e.g. not in Firefox). First download the necessary camera sketch. Then connect the Eye via USB to your computer and drag-and-drop the sketch onto the device. Next, click "Start senseBox Eye camera" and select the Eye's port in the browser. On Linux or macOS the ports are often called "ttyACM0", on Windows "COM3" or similar.

Sometimes it helps to restart your Eye if its not working.

# Why is the camera image black-and-white and pixelated?

The senseBox Eye has far less processing power and memory than a standard computer or mobile phone. To ensure we can still run the trained model on the Eye, we have converted the camera image to black and white and reduced it to 96x96 pixels. This significantly lowers the load on the processor and memory.
