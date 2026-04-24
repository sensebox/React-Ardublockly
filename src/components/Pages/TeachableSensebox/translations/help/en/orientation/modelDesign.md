Before training a neural network, we first have to decide how it is structured.

# Width vs Depth

Two important design choices are **depth** and **width**.

- **Depth** means how many **layers** the neural network has.
- **Width** means how many **neurons** are in one layer.

![depth width](/media/teachable/depth_width.drawio.png)

# When do we need more neurons?

A neuron can learn a pattern in its given input. If there are many patterns in the data, consider adding more neurons.

Generally, wide neural networks (with many neurons) are better at **memorizing** the given trainingsdata. However, if your training recordings do not cover all possible orientations, this can be a disadvantage.

![wide brain](/media/teachable/wide_brain.png)

# When do we need more layers?

By adding more layers we can learn more abstract patterns. The second layer basically finds patterns in the patterns found by the first layer.

Generally, deep neural networks (with many layers) are better at **generalizing** from the given trainingsdata. However, these do not have to match the behavior you originally had in mind.

![deep brain](/media/teachable/deep_brain.png)

# Tip

If you chose very simple classes (such as "up" and "down") consider removing all layers
