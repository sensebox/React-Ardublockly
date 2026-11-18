Once you have trained a model, we should test it with new images that the model has not seen yet.

# Accuracy

The overall accuracy indicates the percentage of correctly classified test images. An accuracy of **100%** would be ideal, but is usually unrealistic. In practice, values of **85%** or higher are considered good.

# Confusion Matrix

The confusion matrix shows for each class how many images were classified correctly and how many were misclassified.

- The row indicates the actual class, the column the predicted class. Each cell shows the test images of that combination.
- The **diagonal** (in green, from top left to bottom right) shows correct predictions.
- **Outside the diagonal** (in orange) are incorrectly classified images.

---

# Note

Instead of capturing new test images manually, you can also choose in the training settings to automatically move a share of the captured sample images to the test images. These images are chosen at random. After changing the share, you should train the model again so that the test images are no longer used for training.
