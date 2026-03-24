Your computer and smartphone (hopefully) have more than enough computing power and available memory to run the trained model in real-time. The senseBox Eye, on the other hand, has significantly fewer resources. It is however also much **smaller** and requires considerably **less power**. For the model to still fit on the Eye and be able to run there, it must first be compressed, then converted, and finally compiled.

# Compression

The model must be reduced in size to fit on the senseBox Eye.

One possible approach to reducing the size is restricting the supported **number range**. A full-size model might, for example, support a large range of decimal numbers, while its compressed variant only uses whole numbers between 1 and 10.

In this case, the original model is almost **2 MB** in size and uses half a MB of working memory. While this is already comparatively small, it is still too large for the senseBox Eye. After compression, it is only about **half a MB** in size and uses one eighth of a MB of working memory. This is about as big as the model can be, while still leaving enough space on the Eye for the rest of the program code.

**Note!**

The compression of a model is almost never lossless. On the senseBox Eye, the trained model will run both slower and with slightly reduced accuracy.

# Conversion

Here in the browser we speak a different language (_Javascript_) than on the senseBox Eye (_Arduino_ or _C++_). To run the trained model on the Eye, we therefore need to **translate** it.

# Compilation

Although we humans use programming languages such as _Arduino_ or _C++_ to program the senseBox Eye, internally the Eye uses its own **machine language**. The process of translating into this machine language is what we refer to as compilation.
