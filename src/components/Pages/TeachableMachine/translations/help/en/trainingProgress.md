The training progress shows you how your model improves over the epochs.

# Metrics

Key metrics include **accuracy** and **loss**.

Accuracy indicates how many images the model has classified correctly.

Loss measures how far the model’s predictions deviate from the actual classes. A lower value is better. To save time, we can stop training as soon as the loss has not improved for several epochs (known as ‘early stopping’).

# Training or Validation

During training, a portion of your captured images is set aside and used for validation. This allows us to check whether the model has genuinely learnt to distinguish between the classes better, or has simply memorised the training images.

# Interpretation

- High training accuracy combined with low validation accuracy indicates **overfitting** – the model has memorized the training images rather than learning general patterns. Collect more images or add more variety to reduce overfitting.
- A decreasing loss over the epochs is a good sign – the model is learning. If the loss plateaus early on, the selected classes are very easy to distinguish, or you should include even more images.
- Fluctuations in validation accuracy can occur if the validation set is very small. With more images per class, the curves become more stable.
