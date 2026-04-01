# Orientation Classification

**Orientation Classification** lets you teach your senseBox Eye to recognise how it is positioned in space.

The senseBox Eye's accelerometer measures the gravitational acceleration along three axes — **X**, **Y**, and **Z**. Depending on the orientation of the device (lying flat, standing upright, tilted, etc.) these values change predictably.

A **decision tree** learns a set of simple rules like "if X > 0.5 and Z < –0.3 → predict: flat" from your labelled examples. After training you can see the full tree diagram.

## Steps

1. Connect your senseBox Eye.
2. Add two or more orientation classes (e.g. "flat", "upright", "tilted left").
3. Put the senseBox Eye into the target orientation and record samples for each class.
4. Click **Train Model**.
5. Watch the live prediction while holding the senseBox Eye.
