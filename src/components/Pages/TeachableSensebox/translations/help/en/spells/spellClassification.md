The **spell classification** lets you cast cast spells with your senseBox Eye like it is a magic wand.

To do this, attach the senseBox to the end of a small stick (e.g. a pen) and use it to draw your own magic spells in the air.

![senseBox wand](/media/teachable/sensebox_wand.gif)

Your movements will be recorded with the **acceleration sensor** onboard the senseBox Eye. These recordings are then converted to an **image** which represents your spell.

![senseBox wand](/media/teachable/spell.gif)

# With what kind of _model_ do we classify the spells?

An **image classification** model is being trained – a model that looks at an image and decides which class it belongs to.

Under the hood is a so-called **neural network**, loosely inspired by the human brain. It consists of many layers that analyze the image step by step.

![Brain Neural Network](/media/teachable/neural-network-brain.drawio.png)

Formally, you can think of the neural network as a very complex **mathematical function** with many unknown values. Depending on which values we assign to the unknowns, the model behaves differently.

![Math Neural Network](/media/teachable/math.drawio.png)

For image processing specifically, we use a neural network with **Convolutional Layers**. These layers actively look for edges, shapes, and patterns in the image.

![features](/media/teachable/feature_cat.drawio.png)
