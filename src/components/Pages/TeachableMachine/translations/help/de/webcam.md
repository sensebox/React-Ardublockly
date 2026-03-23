Nutze deine Handykamera, die Webcam deines Computers oder die Kamera der senseBox Eye, um Bilder für das Training deines Modells aufzunehmen.

# Webcam / Handykamera

Gib dem Browserfenster die nötigen Berechtigungen und stelle sicher, dass keine andere Applikation momentan die Webcam nutzt.

# senseBox Eye Kamera

Diese Funktion ist nicht in allen Browsern möglich (in Firefox z.B. nicht). Schließe zuerst die Eye per USB an dein Notebooke und wähle dann im Browser den Port der Eye (In Linux oder MAC heißen die Ports oft "ttyACM0" und in Windows "COM3"). Wenn du bereits das notwendige Skript zur Bildaufnahme auf die Eye geladen hast solltest du nun das Kamerabild der Eye sehen. ....

# Warum ist das Kamerabild verpixelt und schwarz-weiß?

Die senseBox Eye hat viel weniger Rechenleistung und Speicher zur Verfügung als ein normaler Computer oder ein Handy. Damit wir das trainierte Modell trotzdem auch auf der Eye ausführen können, haben wir das Kamerabild auf schwarz-weiß (statt rot-grün-blau) und 96x96 Pixel reduziert. Dadurch ist die Last für den Prozessor und den Speicher deutlich reduziert.
