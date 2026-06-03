# Max Epochs

"Max Epochs" is the maximum number of complete **training rounds**. In one epoch, the model processes the entire training dataset once and updates its unknown parameters based on what it learned. More epochs give the model more chances to improve, but too many can make it fit the training data too closely (called **_overfitting_**).

# Learning Rate

The Learning Rate controls how strongly the model changes its unknown parameters during each epoch. A higher learning rate makes larger changes and can speed up training, but it can also make learning unstable. A lower learning rate makes smaller changes and usually leads to more careful learning, but training may take longer.

# Early Stopping

Early Stopping is a method that stops training automatically when the model is no longer improving enough. It helps save time and can reduce **_overfitting_** on the training data.
