# Was für ein _Modell_ wird hier trainiert?

Hier wird ein **Bildklassifizierungsmodell** trainiert – ein Modell, das ein Bild ansieht und entscheidet, zu welcher Klasse es gehört.

Unter der Haube steckt ein sogenanntes **Neuronales Netz**, das grob vom menschlichen Gehirn inspiriert ist. Es besteht aus vielen Schichten, die das Bild schrittweise analysieren.

![Brain Neural Network](/media/teachable/neural-network-brain.drawio.png)

Formal betrachtet kannst du dir das neuronale Netz als eine sehr schwierige mathematische Funktion mit vielen unbekannten Werten vorstellen. Je nachdem welche Werte wir für die Unbekannten einsetzen verhält sich das Modell anders.

![Math Neural Network](/media/teachable/math.drawio.png)

Speziell für die Bildverarbeitung nutzen wir ein Neuronales Netz mit **Convolutional Layern**. Diese Schichten suchen gezielt nach Kanten, Formen und Mustern im Bild.

![features](/media/teachable/feature_cat.drawio.png)

Als Basis dient MobileNet – ein schlankes, **vortrainiertes Modell**, das bereits „weiß", wie Bilder grundsätzlich aussehen. Du trainierst es nur noch auf deine eigenen Kategorien um. Das spart Zeit und funktioniert auch mit wenigen Beispielbildern gut.

# Was bedeutet es ein Modell zu _trainieren_?

Beim maschinellen Lernen (**Machine Learning**) bringt man einem Computer bei, Muster zu erkennen – nicht durch feste Regeln, sondern durch Beispiele. Ähnlich wie ein Mensch lernt, eine Katze zu erkennen, indem er viele Katzen sieht, lernt ein Bildklassifizierungsmodell durch das Analysieren vieler Bilder.

Das Training ist genau dieser Lernprozess: Du zeigst dem Modell Hunderte von Beispielbildern, es passt seine internen Parameter an, und mit der Zeit wird es immer besser darin, neue, unbekannte Bilder richtig einzuordnen.

Formal gesehen, bedeutet das Trainieren, dass wir möglichst passende Werte für die unbekannten Werte im Neuronale Netz suchen.

# Wie kann das Modell ein Bild _sehen_?

Für den Computer ist ein Bild ein Raster an Pixeln, wobei jedes Pixel durch mehrere Zahlen definiert wird. Zum Beispiel jeweils eine Zahl für die Farben rot, grün und blau. Je höher die Zahl, desto roter, grüner oder blauer ist das Pixel. Wenn das Modell ein Bild "anschaut", verarbeitet und interpretiret es also eine Matrix aus Zahlen.

![Computer Vision](/media/teachable/computer-vision.drawio.png)

---

# Achtung!

Wenn du diese Seite neu lädst verschwinden deine aufgenommenen Daten und dein trainiertes Modell!
