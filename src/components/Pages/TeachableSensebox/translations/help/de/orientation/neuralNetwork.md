Ein **neuronales Netz** ist ein Modell, das sich grob am menschlichen Gehirn orientiert. Es besteht aus vielen kleinen Recheneinheiten, den **_Neuronen_**, die schichtweise miteinander verbunden sind.

![Brain Neural Network](/media/teachable/neural-network-brain.png)

Ein neuronales Netz kann lernen, Zusammenhänge in Daten zu erkennen. So kann es zum Beispiel entscheiden, zu welcher Klasse eine Aufnahme gehört.

Formal betrachtet kannst du dir ein neuronales Netz wie eine sehr komplizierte mathematische Funktion vorstellen. Diese Funktion hat viele unbekannte Werte, die sogenannten **_Gewichte_**. Je nachdem, welche Werte eingesetzt werden, verhält sich das Modell anders und trifft andere Entscheidungen.

![Math Neural Network](/media/teachable/math.png)

# Was sind _Neuronen_ und _Gewichte_?

Ein **Neuron** ist eine kleine Recheneinheit. Es bekommt Zahlen als Eingabe, verrechnet sie und gibt wieder eine Zahl als Ergebnis weiter. Diese Ergebnisse werden als Eingaben an andere Neuronen weitergeben.

![Neuron](/media/teachable/neuron.png)

Die Verbindungen zwischen den Neuronen haben **Gewichte**. Ein Gewicht legt fest, wie wichtig eine bestimmte Eingabe für das nächste Neuron ist.

- Ein **großes Gewicht** bedeutet: Diese Eingabe ist wichtig.
- Ein **kleines Gewicht** bedeutet: Diese Eingabe ist weniger wichtig.
- Ein **negatives Gewicht** kann bedeuten: Diese Eingabe spricht eher gegen ein bestimmtes Ergebnis.

In den Neuronen werden außerdem **bestimmte mathematische Funktionen** verwendet, zum Beispiel **ReLU** oder **Softmax**. Wie genau diese Funktionen arbeiten, muss man am Anfang aber noch nicht im Detail verstehen.

**_Tipp:_** Wenn du mit der Maus über eine Neurone oder ein Ergebnis hoverst siehst du welche Neuronen mit welchen Gewichten als Eingabe dienen.

# Wie wird ein neuronales Netz _trainiert_?

Im Gegensatz zum Entscheidungsbaum legen wir für das neuronale Netz vorher eine **Struktur** fest. Nur die **Gewichte sind noch unbekannt** und zu Beginn bekommen sie zufällige Werte.

Während dem Training werden dem Modell dann immer wieder die Trainingsdaten gezeigt und es versucht diese zu klassifizieren. Wenn es nicht gut klassifiziert, passt es seine Gewichte ein wenig an.

Dieser Vorgang wird sehr oft wiederholt. So lernen die einzelnen Neuronen nach und nach, bestimmte Muster in den Eingabedaten, und gemeinsam kann das Netzwerk daraus die Daten klassifizieren.
