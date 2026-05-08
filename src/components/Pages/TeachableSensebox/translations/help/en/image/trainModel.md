During training, the model learns to distinguish the defined classes based on the captured images.

# What happens during training?

The model goes through several **epochs** – in each epoch, it is presented with all the training images and classifies them. Depending on if these classifications are right or wrong it adjusts its internal parameters a little bit.

![training process](/media/teachable/training.png)

This is repeated until the model no longer improves or we reach the maximum number of epochs (in this case, 70).

# Notes

- Training runs entirely in the browser – your images are never uploaded.
- After training you can immediately test the model using the live preview.
