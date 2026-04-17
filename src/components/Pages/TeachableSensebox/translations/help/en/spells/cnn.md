To classify the spells, we use an **image classification model** — a model that looks at an image and assigns it to a class.

Under the hood is a so-called neural network, which is loosely inspired by the human brain.

![Brain Neural Network](/media/teachable/neural-network-brain.drawio.png)

The network consists of many **layers** of **neurons**. In our brain, a neuron is a small nerve cell, while in our classification model it is a small computational unit.

![Neuron](/media/teachable/neuron.drawio.png)

Specifically for image processing, we use layers that can process pixels or **groups of pixels** in an image. These individual layers perform so-called **convolutions** on the pixels.

![convolution](/media/teachable/padding_strides.gif)
([Bildquelle](https://github.com/vdumoulin/conv_arithmetic]))

Using these convolutions, the layers can detect important image **features** such as edges, shapes, and patterns.

<explanatory image>
