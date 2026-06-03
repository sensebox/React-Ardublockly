Dein Computer oder dein Smartphone verfügen (hoffentlich) über mehr als genug **Rechenleistung** und **Speicher**, um das trainierte Modell in Echtzeit auszuführen. Die senseBox MCU Eye hat dagegen deutlich weniger Ressourcen. Sie ist dafür aber auch viel **kleiner** und benötigt wesentlich **weniger Strom**. Damit das Modell trotzdem auf die MCU Eye passt und dort ausgeführt werden kann, muss es zunächst komprimiert, anschließend konvertiert und abschließend kompiliert werden.

# Komprimierung

Das Modell muss **verkleinert** werden, um auf die senseBox MCU Eye zu passen.

Eine mögliche Herangehensweise um die Größe zu verringern, ist die Einschränkung des unterstützten **Zahlenbereich**. Ein Modell in voller Größe könnte beispielsweise eine große Spanne an Dezimalzahlen unterstützen, während seine komprimierte Variante nur ganze Zahlen zwischen 1 und 10 verwendet.

In diesem Fall ist das originale Modell fast **2 mB** groß und nutzt einen halben mB an Arbeitsspeicher. Damit ist es zwar bereits vergleichsweise klein, für die senseBox MCU Eye aber trotzdem noch zu groß. Nach der Komprimierung ist nur noch circa einen **halben mB** groß und nutzt einen achtel mB an Arbeitsspeicher. Viel größer darf das Modell nicht sein, damit auf der MCU Eye auch noch genügend Platz für den restlichen Programmcode bleibt.

**Beachte!**

Die Komprimierung des Modell verläuft fast nie Verlustfrei. Auf der senseBox MCU Eye wird das trainierte Modell sowohl langsamer als auch mit leicht geringerer Genauigkeit laufen.

# Konvertierung

Hier im Browser sprechen wir eine andere Sprache (_Javascript_) als auf der senseBox MCU Eye (_Arduino_ bzw. _C++_). Um das trainierte Modell auf der MCU Eye auszuführen müssen wir es also noch **übersetzen**.

# Kompilierung

Wir Menschen nutzen zur Programmierung der senseBox MCU Eye zwar die Programmiersprache _Arduino_ bzw. _C++_, in ihrem innern nutzt die MCU Eye jedoch ihre eigene **Maschinensprache**. Bei der Übersetzung in diese Maschinensprache sprechen wir von Kompilierung.
