# Train Model

Once you have collected samples for all your classes, click **Train Model** to build the decision tree.

## How training works

1. Your samples are split into a training set (80 %) and a validation set (20 %).
2. The algorithm finds the best single x, y, or z threshold to split the data at each node (minimising **Gini impurity**).
3. The tree grows recursively until each branch is pure, too small, or reaches maximum depth.
4. Validation accuracy is shown after training.

## Recommendations

- Collect **at least 5 samples** per class for reliable results.
- Make sure orientations are **clearly different** from each other.
- If accuracy is low, add more samples or reduce the number of similar-looking classes.
