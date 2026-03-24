# Was für ein _Modell_ wird hier trainiert?

Hier wird ein **Bildklassifizierungsmodell** trainiert – ein Modell, das ein Bild ansieht und entscheidet, zu welcher Klasse es gehört.

Unter der Haube steckt ein sogenanntes **Neuronales Netz**, das grob vom menschlichen Gehirn inspiriert ist. Es besteht aus vielen Schichten, die das Bild schrittweise analysieren. Besonders wichtig sind dabei Convolutional Layer, die gezielt nach Kanten, Formen und Mustern im Bild suchen.

Als Basis dient MobileNet – ein schlankes, **vortrainiertes Modell**, das bereits „weiß", wie Bilder grundsätzlich aussehen. Du trainierst es nur noch auf deine eigenen Kategorien um. Das spart Zeit und funktioniert auch mit wenigen Beispielbildern gut.

# Was bedeutet es ein Modell zu _trainieren_?

Beim maschinellen Lernen (**Machine Learning**) bringt man einem Computer bei, Muster zu erkennen – nicht durch feste Regeln, sondern durch Beispiele. Ähnlich wie ein Mensch lernt, eine Katze zu erkennen, indem er viele Katzen sieht, lernt ein KI-Modell durch das Analysieren vieler Bilder.

Das Training ist genau dieser Lernprozess: Du zeigst dem Modell Hunderte von Beispielbildern, es passt seine internen Parameter an, und mit der Zeit wird es immer besser darin, neue, unbekannte Bilder richtig einzuordnen.
