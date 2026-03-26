# What kind of _model_ is being trained here?

An **image classification** model is being trained – a model that looks at an image and decides which class it belongs to.

Under the hood is a so-called **neural network**, loosely inspired by the human brain. It consists of many layers that analyze the image step by step.

![Brain Neural Network](/media/teachable/neural-network-brain.drawio.png)

Formally, you can think of the neural network as a very complex **mathematical function** with many unknown values. Depending on which values we assign to the unknowns, the model behaves differently.

For image processing specifically, we use a neural network with **Convolutional Layers**. These layers actively look for edges, shapes, and patterns in the image.

The foundation is MobileNet – a lightweight, **pre-trained** model that already "knows" what images generally look like. You only need to fine-tune it for your own categories. This saves time and works well even with only a few example images.

# What does it mean to _train_ a model?

In **machine learning**, a computer is taught to recognize patterns – not through fixed rules, but through examples. Just like a person learns to recognize a cat by seeing many cats, an AI model learns by analyzing many images.

Training is exactly this learning process: you show the model hundreds of example images, it adjusts its internal parameters, and over time it gets better and better at correctly classifying new, unseen images.

Formally speaking, training means searching for the most suitable values for the unknowns in the neural network.

# How can the model _see_ an image?

To a computer, an image is simply a collection of color values, more precisely, a grid of pixels. The model doesn't "see" a cat or a stop sign – it processes a matrix of numbers.

![Computer Vision](/media/teachable/computer-vision.drawio.png)
