# How to connect the senseBox MCU Eye

This feature is not available in all browsers (e.g. not in Firefox). First download the necessary accelerometer sketch. Then connect the MCU Eye via USB to your computer and drag-and-drop the sketch onto the device. Next, click "Connect senseBox MCU Eye" and select the MCU Eye's port in the browser. On Linux or macOS the ports are often called "ttyACM0", on Windows "COM3" or similar.

Sometimes it helps to restart your MCU Eye if its not working.

# The Accelerometer

On the senseBox MCU Eye you can find an **acceleration sensor** located at the top next to the camera.

![MCU Eye acceleration sensor](/media/teachable/eye_acceleration_sensor_circle.png)

It can measure acceleration in three directions: along the **X, Y, and Z axes**.

You can imagine this as an invisible coordinate system inside the sensor. Each axis points in a different direction. This allows the sensor to detect whether the device is moving left or right, forward or backward, or up and down.

![coordinates](/media/teachable/coordinates.png)

When the senseBox MCU Eye is lying still on a table, it is not actually moving at all. Nonetheless, the sensor still measures something — **_gravity_**.

# Using _gravity_ to determine orientation

The Earth pulls all things downward with its gravity. This force also acts on the acceleration sensor. That is why the sensor shows values even when the device is not moving.

Gravity acts with approximately **9,81 m/s²**.

This allows us to determine how the senseBox MCU Eye is currently oriented.

For example:

- If the senseBox MCU Eye is lying flat on a table, the Z-axis measures approximately 9.81.
- If you place the device on its side, the X- or Y-axis measures approximately 9.81 instead.
- If you tilt the sensor diagonally, gravity is distributed across multiple axes.
