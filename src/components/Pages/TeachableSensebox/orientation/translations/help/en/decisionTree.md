# Decision Tree

After training, the **decision tree** diagram shows the exact rules the model uses to classify orientations.

## Reading the diagram

- **Internal nodes** show a condition such as `x ≤ 0.42`. Samples that satisfy the condition go to the **upper** child; others go to the **lower** child.
- **Leaf nodes** (right-most boxes) show the predicted class and the number of training samples that ended up there.
