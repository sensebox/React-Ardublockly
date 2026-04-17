Der Trainingsverlauf zeigt dir, wie sich dein Modell über die Epochen hinweg verbessert.

# Metriken

Wichtige Metriken sind zum einen die **Genauigkeit** (Accuracy) und der **Loss**.

Die Genauigkeit gibt an, wie viele Bilder das Modell korrekt klassifiziert hat.

Der Loss misst, wie weit die Vorhersagen des Modells von den tatsächlichen Klassen abweichen. Ein niedrigerer Wert ist besser. Um Zeit zu sparen können wir das Training beenden sobald der Loss sich mehrere Epochen lang nicht verbessert (sogenanntes "Early Stopping").

# Training oder Validierung

Während dem Training wird ein Teil deiner aufgenommenen Bilder zurückgehalten und zur Validierung verwendet. Damit können wir überprüfen, ob das Modell wirklich gelernt hat die Klassen besser zu unterscheiden oder nur die Trainingsbilder auswendig gelernt hat.

# Interpretation

- Eine hohe Trainings-Genauigkeit bei gleichzeitig niedriger Validierungs-Genauigkeit deutet auf **Überanpassung (Overfitting)** hin – das Modell hat die Trainingsbilder auswendig gelernt, statt allgemeine Muster zu erkennen. Sammle mehr Bilder oder füge mehr Vielfalt hinzu, um Overfitting zu reduzieren.
- Ein sinkender Loss über die Epochen ist ein gutes Zeichen – das Modell lernt. Stagniert der Loss frühzeitig, sind die gewählten Klassen sehr einfach zu unterscheiden oder du solltest noch mehr Bilder aufnehmen.
- Schwankungen in der Validierungs-Genauigkeit können auftreten, wenn die Validierungsmenge sehr klein ist. Mit mehr Bildern pro Klasse werden die Kurven stabiler.
