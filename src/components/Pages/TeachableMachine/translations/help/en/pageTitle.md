# What kind of _model_ is being trained here?

Here, an **image classification** model is being trained – a model that looks at an image and decides which class it belongs to.

Under the hood is a so-called **neural network**, loosely inspired by the human brain. It consists of many layers that analyze the image step by step. Particularly important are Convolutional Layers, which specifically look for edges, shapes, and patterns in the image.

The foundation is MobileNet – a lightweight, **pre-trained** model that already "knows" what images generally look like. You only need to fine-tune it for your own categories. This saves time and works well even with only a few example images.

# What does it mean to _train_ a model?

In **machine learning**, a computer is taught to recognize patterns – not through fixed rules, but through examples. Just like a person learns to recognize a cat by seeing many cats, an AI model learns by analyzing many images.

Training is exactly this learning process: you show the model hundreds of example images, it adjusts its internal parameters, and over time it gets better and better at correctly classifying new, unseen images.
