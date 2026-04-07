# Entscheidungsbaum

Nach dem Training zeigt das **Entscheidungsbaum-Diagramm** genau die Regeln, die das Modell zur Klassifizierung von Orientierungen verwendet.

## Das Diagramm lesen

- **Interne Knoten** zeigen eine Bedingung wie `x ≤ 0,42`. Aufnahmen, die die Bedingung erfüllen, gehen zum **oberen** Kind; andere zum **unteren**.
- **Blattknoten** (Endknoten) zeigen die vorhergesagte Klasse und die Anzahl der Trainingsaufnahmen, die dort gelandet sind.
