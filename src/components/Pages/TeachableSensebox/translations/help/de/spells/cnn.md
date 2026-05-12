Um die Zaubersprüche zu klassifizieren nutzen wir ein **Bildklassifizierungsmodell** – ein Modell, das ein Bild ansieht und zu einer Klasse zuordnet.

Unter der Haube steckt ein sogenanntes **Neuronales Netz**, das grob vom menschlichen Gehirn inspiriert ist.

![Brain Neural Network](/media/teachable/neural-network-brain.png)

Das Netz besteht aus vielen **Schichten** von **Neuronen**. In unserem Gehirn ist ein Neuron eine kleine Nervenzelle und in unserem Klassifizierungsmodell ist es eine kleine Recheneinheit.

![Neuron](/media/teachable/neuron.png)

Speziell für die Bildverarbeitung nutzen wir eine Art Neuron, das einen Bildausschnitt (also eine Gruppe an Pixeln) verarbeiten kann. Das Neuron nutzt einen **Filter** um sich seinen jeweilige Ausschnitt anzuschauen und berechnet daraus einen Ausgabewert. Wenn wir diese Neuronen zu einer Schicht zusammen setzen, ist jedes Neuron für jeweils einen anderen Bildausschnitt zuständig. Diese Art von Schicht nennen wir dann einen **Convolutional Layer**.

![convolution](/media/teachable/conv.gif)

Wenn wir ein Eingabebild mit einem Convolutional Layer verarbeiten, entsteht Ende quasi ein neues Bild, in dem wir sehen können, wie stark die einzelnen Neuronen auf ihre jeweiligen Pixelgruppen reagiert haben.

Letztendlich erkennen die jeweiligen Convolutional Layer im Neuronalen Netz jeweils bestimmte Bild**merkmale**, wie Kanten, Formen und Muster.

![trained](/media/teachable/trained.png)

---

# Der Covolutional Layer als Metapher

Stell dir vor die Neuronen des Convolutional Layers als Besucher in einem Kino vor. Wir können den Neuronen nun bestimmte "Brillen" geben (sogenannte **Filter**), die beeinflussen, wie die Neuronen den Film warnehmen. Mit einer Lesebrille sehen die Neuronen alles unscharf, mit einer Lupe sieht der Film ganz klein oder mit einem Fernglas ganz groß aus.

![cinema metaphor](/media/teachable/cinema.png)
