# Decision Tree

After training, the **decision tree** diagram shows the exact rules the model uses to classify orientations.

## Reading the diagram

- **Internal nodes** show a condition such as `x ≤ 0.42`. Samples that satisfy the condition go to the **left** child; others go to the **right** child.
- **Leaf nodes** (coloured boxes) show the predicted class and the number of training samples that ended up there.
- The diagram is **read-only** — the model is fixed after training.

## Why a decision tree?

Decision trees are transparent: you can follow every decision step-by-step. This makes it easy to understand **why** the model predicted a certain orientation.

For orientation data (static x/y/z angles against gravity) a shallow decision tree is often more accurate than a neural network because the decision boundaries are naturally axis-aligned.
