In the **Model Testing** section you can capture your own test images for each class. The trained model has not seen these images during training. This allows us to evaluate how well the model ultimately performs.

Once you have at least one test image per class, click **Test model**. You will then see the accuracy and the confusion matrix.

In the training settings you can also move a share of your training images to the test images. These images are chosen at random and are no longer used for training.

# Accuracy

The overall accuracy indicates the percentage of correctly classified test images. An accuracy of **100%** would be ideal, but is usually unrealistic. In practice, values of **85%** or higher are considered good.

# Confusion Matrix

The confusion matrix shows for each class how many images were classified correctly and how many were misclassified.

- The row indicates the actual class, the column the predicted class. Each cell shows the test images of that combination.
- The **diagonal** (in green, from top left to bottom right) shows correct predictions.
- **Outside the diagonal** (in orange) are incorrectly classified images.
