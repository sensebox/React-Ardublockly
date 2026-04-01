# Modell trainieren

Sobald du für alle Klassen Aufnahmen gesammelt hast, klicke auf **Modell trainieren**, um den Entscheidungsbaum zu erstellen.

## So funktioniert das Training

1. Deine Aufnahmen werden in ein Trainingsset (80 %) und ein Validierungsset (20 %) aufgeteilt.
2. Der Algorithmus findet für jeden Ast den besten x-, y- oder z-Schwellenwert zur Aufteilung der Daten (minimiert **Gini-Unreinheit**).
3. Der Baum wächst rekursiv, bis jeder Ast rein ist, zu wenige Proben enthält oder die maximale Tiefe erreicht.
4. Nach dem Training wird die Validierungsgenauigkeit angezeigt.

## Empfehlungen

- Sammle **mindestens 5 Aufnahmen** pro Klasse für zuverlässige Ergebnisse.
- Achte darauf, dass die Orientierungen **klar voneinander unterscheidbar** sind.
- Wenn die Genauigkeit gering ist, füge mehr Aufnahmen hinzu oder reduziere die Anzahl ähnlicher Klassen.
