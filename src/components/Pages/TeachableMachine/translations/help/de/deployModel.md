Dein Computer und Smartphone verfügen (hoffentlich) über mehr als genug Rechenleistung und Speicher, um das trainiertes Modell in Echtzeit auszuführen. Die senseBox Eye ist wesentlich kleiner und hat deutlich weniger Speicherplatz. Damit das Modell trotzdem auf die Eye passt und dort verarbeitet werden kann, muss es konvertiert und kompiliert werden.

# Konvertierung

Um dein trainiertes Modell auf der senseBox Eye auszuführen, muss es erst in ein Arduino-kompatibles Format konvertiert werden. Das konvertierte Format weist weniger Details auf als das Original. Die Konvertierung kann einige Zeit in Anspruch nehmen.

# Komprimierung

Nach der Konvertierung muss das Modell auf eine Größe komprimiert werden, die auf die senseBox Eye passt. Dies lässt sich beispielsweise erreichen, indem man den unterstützten Zahlenbereich einschränkt. Ein Modell in voller Größe unterstützt besipielsweise eine große Spanne an Dezimalzahlen, während seine komprimierte Version nur ganze Zahlen zwischen 1 und 10 unterstützt.
