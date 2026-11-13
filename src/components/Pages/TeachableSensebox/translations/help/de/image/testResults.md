Im Abschnitt **Modell Testing** kannst du für jede Klasse eigene Testbilder aufnehmen. Das trainierte Modell hat diese Bilder während des Trainings nicht gesehen. Damit können wir evaluieren, wie gut das Modell letztendlich abschneidet.

Sobald du mindestens ein Testbild pro Klasse hast, klicke auf **Modell testen**. Danach siehst du die Genauigkeit und die Konfusionsmatrix.

In den Trainingseinstellungen kannst du außerdem einen Anteil deiner Trainingsbilder in die Testbilder verschieben. Diese Bilder werden zufällig ausgewählt und dann nicht mehr für das Training verwendet.

# Genauigkeit

Die Gesamtgenauigkeit gibt den Prozentsatz der korrekt klassifizierten Testbilder an. Eine Genauigkeit von **100%** wäre ideal, jedoch meistens unrealistisch. In der Praxis sind Werte ab **85%** gut.

# Konfusionsmatrix

Die Konfusionsmatrix zeigt für jede Klasse, wie viele Bilder korrekt und wie viele falsch klassifiziert wurden.

- die Zeile gibt die tatsächliche Klasse an, die Spalte die klassifizierte. In jeder Zelle siehst du die Testbilder dieser Kombination.
- Die **Diagonale** (in grün, von oben links nach unten rechts) zeigt korrekte Klassifizierungen.
- **Außerhalb der Diagonale** (in orange) stehen falsch klassifizierte Bilder.
