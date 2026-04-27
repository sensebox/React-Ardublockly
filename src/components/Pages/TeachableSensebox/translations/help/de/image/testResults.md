Wenn du mindestens 10 Bilder pro Klasse gesammelt hast, wird ein Teil deiner gesammelten Bilder zu Testzwecken genutzt. Das trainierte Modell hat diese Bilder nicht während dem Training gesehen. Damit können wir evaluieren wie gut das Modell letztendlich abschneidet.

# Genauigkeit

Die Gesamtgenauigkeit gibt den Prozentsatz der korrekt klassifizierten Testbilder an. Eine Genauigkeit von **100%** wäre ideal, jedoch meistens unrealistisch. In der Praxis sind Werte ab **85%** gut.

# Konfusionsmatrix

Die Konfusionsmatrix zeigt für jede Klasse, wie viele Bilder korrekt und wie viele falsch klassifiziert wurden.

- die Zeile gibt die tatsächliche Klasse an, die Spalte die vorhergesagte.
- Die **Diagonale** (in grün, von oben links nach unten rechts) zeigt korrekte Vorhersagen.
- **Außerhalb der Diagonale** (in rot) stehen falsch klassifizierte Bilder.
