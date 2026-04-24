Based on the recorded training data, a **decision tree** is generated. This tree can be used to determine which class a recorded orientation belongs to.

![decision tree tree](/media/teachable/decision_tree.png)

Internal nodes show a condition. In our case, a condition is whether a numerical value exceeds a certain numerical value (_threshold_). Recordings that satisfy the condition go to the right, to the upper node; the others go to the lower node.

![node](/media/teachable/node.png)

The first node (to the far left) is also called the **root node** and connections between nodes are called **branches**.

Leaf nodes show the predicted class and the number of training recordings that ended up there.

![leaf](/media/teachable/leaf.png)

# How is the decision tree generated?

For each of x, y, and z, **all possible _thresholds_ are tried** as conditions. Each threshold is evaluated: how mixed are the resulting groups? A group that contains only recordings from a single class is perfect. A group with an even distribution of recordings from all classes is the worst possible outcome. The threshold with the clearest separation is chosen as the condition. If several thresholds receive the same evaluation, the first possible one is chosen. This process continues until all classes are clearly separated from one another.

**_Tip:_** If you hover over a node or leaf you can see how many recordings belong to that group.
