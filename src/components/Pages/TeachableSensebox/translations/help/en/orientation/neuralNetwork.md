A **neural network** is a model that is loosely inspired by the human brain. It consists of many small computational units called **_neurons_**, which are connected to one another in layers.

![Brain Neural Network](/media/teachable/neural-network-brain.png)

A neural network can learn to recognize patterns in data. For example, it can decide which class a recording belongs to.

Formally, you can think of a neural network as a very complicated mathematical function. This function has many unknown values, called weights. Depending on which values are used, the model behaves differently and makes different decisions.

![Math Neural Network](/media/teachable/math.png)

# What are _neurons_ and _weights_?

A **neuron** is a small computational unit. It receives numbers as input, combines them, and outputs another number as a result. These results are then passed on as inputs to other neurons.

![Neuron](/media/teachable/neuron.png)

The connections between neurons have \*\*weights. A weight determines how important a particular input is for the next neuron.

- A **large weight** means: this input is important.
- A **small weight** means: this input is less important.
- A **negative weight** can mean: this input argues against a certain result.

Internally neurons also use certain **mathematical functions**, such as **ReLU** or **Softmax**. Exactly how these functions work does not need to be understood in detail at this point.

**_Tip:_** If you hover over a neuron or ouput you can see which neurons with which weights serve as input.

# How is a neural network _trained_?

Unlike a decision tree, for a neural network we define a **structure** in advance. Only the **weights are still unknown**, and at the beginning they are given random values.

During training, the model is shown the training data again and again, and it tries to classify it. If it does not classify well, it adjusts its weights a little.

This process is repeated many times. In this way, the individual neurons gradually learn certain **patterns** in the input and together form a model that can make useful predictions.
