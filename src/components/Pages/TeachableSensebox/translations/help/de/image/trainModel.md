Beim Training lernt das Modell, die definierten Klassen anhand der aufgenommenen Bilder zu unterscheiden.

# Was passiert beim Training?

Das Modell durchläuft mehrere Iterationen (sogenannte **Epochen**) – in jeder Epoche wird es mit allen Trainingsbildern konfrontiert und klassifiziert diese. Je nachdem ob diese Klassifikationen falsch oder richtig sind passt es seine internen Parameter ein wenig an.

![training process](/media/teachable/training.png)

Dies wird solange wiederholt, bis das Modell sich nicht mehr verbessert oder wir die maximale Anzahl an Epochen (in diesem Falle 70) erreichen.

# Hinweise

- Das Training läuft vollständig im Browser – deine Bilder werden nicht hochgeladen.
- Nach dem Training kannst du das Modell direkt in der Live-Vorschau testen.
