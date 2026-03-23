Your computer and smartphone (hopefully) have more than enough computing power and available memory to run the trained model in real-time. The senseBox Eye is much smaller and more constrained. To make the model fit and processable on the Eye we need to convert and compress the model.

# Conversion

To run your trained model on the senseBox Eye, it first needs to be converted to an Arduino-compatible format. The conversion might take a few minutes. The converted format basically has less details than the original.

# Compression

After conversion the model has to be compressed down to a size that will fit on the senseBox Eye. We can achieve this for example by reducing the range of numbers that the model supports. A full size model might support all kinds of decimal numbers, while its compressed version only support whole numbers between 1 and 10.
