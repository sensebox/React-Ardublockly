Mit der **Zauberspruch Klassifizierung** kannst du deine senseBox Eye wie einen Zauberstab verwenden.

Befestige dafür die senseBox am Ende eines kleinen Stabes (z.B. ein Stift) und zeichne damit deine eigenen Zaubersprüche in die Luft.

![senseBox wand](/media/teachable/sensebox_wand.gif)

Deine Bewegungen werden mit dem **Beschleunigungssensor** der senseBox Eye aufgezeichnet. Diese Aufzeichnungen werden anschließend in ein **Bild** umgewandelt, das deinen Zauberspruch darstellt.

![senseBox wand](/media/teachable/spell.gif)

# Mit welchem _Model_ wird dein Zauberspruch klassifiziert?

Hier wird ein **Bildklassifizierungsmodell** trainiert – ein Modell, das ein Bild ansieht und entscheidet, zu welcher Klasse es gehört.

Unter der Haube steckt ein sogenanntes **Neuronales Netz**, das grob vom menschlichen Gehirn inspiriert ist. Es besteht aus vielen Schichten, die das Bild schrittweise analysieren.

![Brain Neural Network](/media/teachable/neural-network-brain.drawio.png)

Formal betrachtet kannst du dir das neuronale Netz als eine sehr schwierige mathematische Funktion mit vielen unbekannten Werten vorstellen. Je nachdem welche Werte wir für die Unbekannten einsetzen verhält sich das Modell anders.

![Math Neural Network](/media/teachable/math.drawio.png)

Speziell für die Bildverarbeitung nutzen wir ein Neuronales Netz mit **Convolutional Layern**. Diese Schichten suchen gezielt nach Kanten, Formen und Mustern im Bild.

![features](/media/teachable/feature_cat.drawio.png)
