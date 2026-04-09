Bevor ein neuronales Netz trainiert werden kann, muss man zuerst festlegen, wie es aufgebaut ist.

# Breite oder Tiefe

Beim Aufbau eines neuronalen Netzes sind vor allem zwei Eigenschaften wichtig: **Tiefe** und **Breite**.

- Die **Tiefe** beschreibt, aus wie vielen **Schichten** das neuronale Netz besteht.
- Die **Breite** beschreibt, wie viele **Neuronen** sich in einer einzelnen Schicht befinden.

# Wann braucht man mehr Neuronen?

Ein einzelnes Neuron kann lernen, bestimmte Muster in den Eingabedaten zu erkennen. Wenn in den Daten **viele unterschiedliche Muster** vorkommen, kann es sinnvoll sein, mehr Neuronen zu verwenden.

Breite neuronale Netze, also Netze mit vielen Neuronen pro Schicht, sind oft besonders gut darin, sich die **Trainingsdaten haargenau einzuprägen**. Wenn deine Trainingsaufnahmen allerdings nicht alle möglichen Orientierungen abdecken, kann dies ein Nachteil sein.

# Wann braucht man mehr Schichten?

Wenn man mehr Schichten hinzufügt, kann das Modell zunehmend **abstraktere Muster** lernen. Die zweite Schicht erkennt quasi Muster in den Mustern, die von der ersten Schicht erkannt wurden

Tiefe neuronale Netze, also Netze mit vielen Schichten, sind oft besonders gut darin, aus den Trainingsdaten **allgemeinere Regeln** abzuleiten. Diese müssen aber nicht unbedingt mit dem Verhalten übereinstimmen, was du dir vorgestellt hast.

# Tipp

Falls du sehr einfache Klassen gewählt hast (zum Beispiel nur „oben“ und „unten“) kannst du auch mal ausprobieren alle Schichten zu entfernen.
