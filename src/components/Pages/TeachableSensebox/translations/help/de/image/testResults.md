Sobald du ein Modell trainiert hast, sollten wir es mit neuen Bildern testen, die das Modell noch nicht gesehen hat.

# Genauigkeit

Die Gesamtgenauigkeit gibt den Prozentsatz der korrekt klassifizierten Testbilder an. Eine Genauigkeit von **100%** wäre ideal, jedoch meistens unrealistisch. In der Praxis sind Werte ab **85%** gut.

# Konfusionsmatrix

Die Konfusionsmatrix zeigt für jede Klasse, wie viele Bilder korrekt und wie viele falsch klassifiziert wurden.

- die Zeile gibt die tatsächliche Klasse an, die Spalte die klassifizierte. In jeder Zelle siehst du die Testbilder dieser Kombination.
- Die **Diagonale** (in grün, von oben links nach unten rechts) zeigt korrekte Klassifizierungen.
- **Außerhalb der Diagonale** (in orange) stehen falsch klassifizierte Bilder.

---

# Hinweis

Anstatt manuell neue Testbilder aufzunehmen, kannst du in den Trainingseinstellungen auch auswählen, dass ein Teil der aufgenommenen Beispielbilder automatisch zu den Testbildern verschoben werden soll. Diese Bilder werden zufällig ausgewählt. Du solltest das Modell noch einmal neu trainieren, nachdem du den Anteil geändert hast, damit die Testbilder nicht mehr im Training verwendet werden.
