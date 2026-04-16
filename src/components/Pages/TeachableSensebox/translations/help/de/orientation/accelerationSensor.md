# Wie verbinde ich mich mit der senseBox Eye

Diese Funktion ist nicht in allen Browsern möglich (in Firefox z.B. nicht). Lade zuerst den Beschleunigungssensor-Sketch herunter. Schließe die Eye per USB an dein Notebook und lade den sketch per drag-und-drop auf die Eye. Klicke anschließend auf den Button zur Verbindung mit der senseBox Eye und wähle dann im Browser den Port der Eye. In Linux oder MAC heißen die Ports oft "ttyACM0" und in Windows z.B. "COM3".

Es kann manchmal helfen die Eye noch einmal neu zu starten wenn es nicht direkt funktioniert.

# Der Beschleunigungssensor

Auf der senseBox Eye befindet sich oben neben der Kamera ein Beschleunigungssensor.

![eye acceleration sensor](/media/teachable/eye_acceleration_sensor_circle.png)

Dieser kann in drei Richtungen Beschleunigung messen: entlang der **X-, Y- und Z-Achse**.

Man kann sich das wie ein unsichtbares Koordinatensystem im Inneren des Sensors vorstellen. Jede Achse zeigt in eine andere Richtung. So erkennt der Sensor, ob sich das Gerät nach links oder rechts, nach vorne oder hinten oder nach oben und unten bewegt.

![coordinates](/media/teachable/coordinates.drawio.png)

Wenn die senseBox Eye ruhig auf einem Tisch liegt, bewegt sie sich eigentlich gar nicht. Trotzdem misst der Sensor dann etwas — und zwar die **_Schwerkraft_**.

# Orientierung mit der _Schwerkraft_ bestimmen

Die Erde zieht alle Dinge mit ihrer Schwerkraft nach unten. Diese Kraft wirkt auch auf den Beschleunigungssensor. Deshalb zeigt der Sensor selbst dann Werte an, wenn sich das Gerät nicht bewegt.

Die Schwerkraft wirkt mit ungefähr **9,81 m/s²**.

Dadurch können wir herausfinden, wie die senseBox Eye gerade orientiert wird.

Am Beispiel:

- Liegt die senseBox Eye flach auf dem Tisch, misst die Z-Achse ungefähr 9,81.
- Stellt man das Gerät auf die Seite, messen stattdessen die X- oder Y-Achse ungefähr 9,81.
- Kippt man den Sensor schräg, verteilt sich die Schwerkraft auf mehrere Achsen.

# Hinweis

Es ist nicht in allen Browsern möglich sich mit der senseBox Eye und ihrem Beschleunigungssensor zu verbinden (in Firefox z.B. nicht). Nutze Bespielsweise Chrome oder Safari.
