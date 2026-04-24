To classify the spells, we use an **image classification model** — a model that looks at an image and assigns it to a class.

Under the hood is a so-called neural network, which is loosely inspired by the human brain.

![Brain Neural Network](/media/teachable/neural-network-brain.png)

The network consists of many **layers** of **neurons**. In our brain, a neuron is a small nerve cell, while in our classification model it is a small computational unit.

![Neuron](/media/teachable/neuron.png)

Specifically for image processing, we use a type of neuron that can process a small **image section** (that is, a group of pixels). The neuron uses a **filter** to examine its particular section and calculates an output value from it. When we combine these neurons into a layer, each neuron is responsible for a **specific area** of the image and its corresponding group of pixels. We call this type of layer a **convolutional layer**. When we process an input image with a convolutional layer, the result is, in a way, a new image in which we can see how strongly the individual neurons responded to their respective groups of pixels.

![convolution](/media/teachable/padding_strides.gif)
([image source](https://github.com/vdumoulin/conv_arithmetic]))

Ultimately, the different convolutional layers in the neural network detect specific image **features**, such as edges, shapes, and patterns.

<explanatory image>
