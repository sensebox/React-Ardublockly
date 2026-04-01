# Entscheidungsbaum

Nach dem Training zeigt das **Entscheidungsbaum-Diagramm** genau die Regeln, die das Modell zur Klassifizierung von Orientierungen verwendet.

## Das Diagramm lesen

- **Interne Knoten** zeigen eine Bedingung wie `x ≤ 0,42`. Aufnahmen, die die Bedingung erfüllen, gehen zum **linken** Kind; andere zum **rechten**.
- **Blattknoten** (farbige Rechtecke) zeigen die vorhergesagte Klasse und die Anzahl der Trainingsaufnahmen, die dort gelandet sind.
- Das Diagramm ist **schreibgeschützt** — das Modell ist nach dem Training festgelegt.

## Warum ein Entscheidungsbaum?

Entscheidungsbäume sind transparent: Du kannst jeden Entscheidungsschritt nachvollziehen. Damit lässt sich leicht verstehen, **warum** das Modell eine bestimmte Orientierung vorhergesagt hat.

Für Orientierungsdaten (statische x/y/z-Winkel gegenüber der Schwerkraft) ist ein flacher Entscheidungsbaum oft genauer als ein neuronales Netz, da die Entscheidungsgrenzen von Natur aus achsenausgerichtet sind.
