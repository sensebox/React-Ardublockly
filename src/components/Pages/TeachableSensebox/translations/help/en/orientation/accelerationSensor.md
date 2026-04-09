On the senseBox Eye you can find an acceleration sensor located at the top next to the camera.

![eye acceleration sensor](/media/teachable/eye_acceleration_sensor_circle.png)

It can measure acceleration in three directions: along the **X, Y, and Z axes**.

You can imagine this as an invisible coordinate system inside the sensor. Each axis points in a different direction. This allows the sensor to detect whether the device is moving left or right, forward or backward, or up and down.

![coordinates](/media/teachable/coordinates.drawio.png)

When the senseBox Eye is lying still on a table, it is not actually moving at all. Nonetheless, the sensor still measures something — **_gravity_**.

# Using _gravity_ to determine orientation

The Earth pulls all things downward with its gravity. This force also acts on the acceleration sensor. That is why the sensor shows values even when the device is not moving.

Gravity acts with approximately **9,81 m/s²**.

This allows us to determine how the senseBox Eye is currently oriented.

For example:

- If the senseBox Eye is lying flat on a table, the Z-axis measures approximately 9.81.
- If you place the device on its side, the X- or Y-axis measures approximately 9.81 instead.
- If you tilt the sensor diagonally, gravity is distributed across multiple axes.

# Note

It is not possible to connect to the senseBox Eye and its acceleration sensor in all browsers (for example, not in Firefox). Use Chrome or Safari instead.
