Once you have collected at least 10 images per class, a portion of your collected images will be used for testing. The trained model has not seen these images during training. This allows us to evaluate how well the model ultimately performs.

# Accuracy

The overall accuracy indicates the percentage of correctly classified test images. An accuracy of **100%** would be ideal, but is usually unrealistic. In practice, values of **85%** or higher are considered good.

# Confusion Matrix

The confusion matrix shows for each class how many images were classified correctly and how many were misclassified.

- The row indicates the actual class, the column the predicted class.
- The **diagonal** (in green, from top left to bottom right) shows correct predictions.
- **Outside the diagonal** (in red) are incorrectly classified images.
