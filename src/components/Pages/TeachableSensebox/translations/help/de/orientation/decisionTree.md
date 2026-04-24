Basierend auf den aufgenommenen Trainingsdaten wird ein **Entscheidungsbaum** generiert. Mit diesem Baum kann entschieden werden zu welcher Klasse eine aufgenommene Orientierung gehört.

![decision tree tree](/media/teachable/decision_tree.png)

**Interne Knoten** zeigen eine Bedingung. In unserem Fall ist eine Bedingung ein überschrittener Zahlenwert (_Schwellwert_). Aufnahmen, die die Bedingung erfüllen, gehen nach rechts zum **oberen** Knoten; Andere zum **Unteren**.

![node](/media/teachable/node.png)

Den ersten Knoten (also ganz links) nennt man auch einen **Wurzelknoten** und die Verbindungen zwischen den Knoten **Äste/Zweige**.

**Blattknoten** (Endknoten) zeigen die vorhergesagte Klasse und die Anzahl der Trainingsaufnahmen, die dort gelandet sind.

![leaf](/media/teachable/leaf.png)

# Wie wird der Entscheidungsbaum generiert?

Für jeweils x, y und z werden **alle möglichen _Schwellwerte_ als Bedingungen ausprobiert**. Jeder Schwellwert wird bewertet: Wie gemischt sind die entstehenden Gruppen noch? Eine Gruppe, die nur Aufnahmen einer einzigen Klasse enthält, ist perfekt. Eine Gruppe mit gleichmäßig vielen Aufnahmen aller Klassen ist das Schlechteste, was passieren kann. Der Schwellwert mit der klarsten Trennung wird als Bedingung gewählt. Falls mehrere Schwellwerte die selbe Bewertung erhalten haben, wird die erste Mögliche gewählt. Dies wird solange fortgesetzt, bis alle Klassen klar voneinander getrennt sind.

**_Tipp:_** Wenn du mit der Maus über einen Knoten oder ein Blatt hoverst siehst du wie viele Aufnahmen zu dieser Gruppe gehören.
