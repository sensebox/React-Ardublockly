Um die Zaubersprüche zu klassifizieren nutzen wir ein **Bildklassifizierungsmodell** – ein Modell, das ein Bild ansieht und zu einer Klasse zuordnet.

Unter der Haube steckt ein sogenanntes **Neuronales Netz**, das grob vom menschlichen Gehirn inspiriert ist.

![Brain Neural Network](/media/teachable/neural-network-brain.drawio.png)

Das Netz besteht aus vielen **Schichten** von **Neuronen**. In unserem Gehirn ist ein Neuron eine kleine Nervenzelle und in unserem Klassifizierungsmodell ist es eine kleine Recheneinheit.

![Neuron](/media/teachable/neuron.drawio.png)

Speziell für die Bildverarbeitung nutzen wir Schichten die Pixel oder Pixelgruppen in einem Bild verarbeiten können. Die einzelnen Schichten führen sogenannte **Convolutions** auf den Pixeln aus.

![convolution](/media/teachable/padding_strides.gif)
([Bildquelle](https://github.com/vdumoulin/conv_arithmetic]))

Mit diesen Convolutions können die Schichten wichtige Bild**merkmale** erkennen, wie Kanten, Formen und Muster.

<Erklärbild>
