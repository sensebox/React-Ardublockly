import Blockly from 'blockly';

/**
 * Display
 */

Blockly.Msg.senseBox_display_beginDisplay = "Display initialisieren";
Blockly.Msg.senseBox_display_beginDisplay_tooltip = `Initialisiert das Display. Dieser Block muss im Setup() verwendet werden. 

**Anschluss:** I2C
`
Blockly.Msg.senseBox_display_clearDisplay_tooltip = "Löscht die Anzeige auf dem Display. Sollte immer zu Begin oder am Ende der Endlosschleife aufgerufen werden.";
Blockly.Msg.senseBox_display_clearDisplay = "Display löschen";
Blockly.Msg.senseBox_display_printDisplay = "Schreibe Text/Zahl";
Blockly.Msg.senseBox_display_printDisplay_tooltip = "Zeigt eine Zahl/Text auf dem Display an. Über die X- und Y-Koordinaten kann die Position auf dem Display bestimmt werden. Die Schriftgröße lässt sich in ganzzahligen Werten zwischen 1 und 4 einstellen. Das Display hat eine Auflösung von 128x64 Pixeln (X- und Y-Achse)";
Blockly.Msg.senseBox_display_printDisplay_x = "x-Koordinate";
Blockly.Msg.senseBox_display_printDisplay_y = "y-Koordinate";
Blockly.Msg.senseBox_display_printDisplay_value = "Wert";
Blockly.Msg.senseBox_display_setSize = "Schriftgröße";
Blockly.Msg.senseBox_display_setSize_tip = "Ändere die Schriftgröße auf einen Wert zwischen 1 und 10.";
Blockly.Msg.senseBox_display_color = "Schriftfarbe";
Blockly.Msg.senseBox_display_white = "Weiß";
Blockly.Msg.senseBox_display_black = "Schwarz";
Blockly.Msg.sensebox_display_show = "Zeige auf dem Display";
Blockly.Msg.sensebox_display_show_tip = "Zeigt den Nachfolgenden Inhalt auf dem Bildschirm";
Blockly.Msg.senseBox_dipslay_plotTitle = "Titel";
Blockly.Msg.senseBox_display_plotDisplay = "Zeichne Diagramm";
Blockly.Msg.senseBox_display_plotXLabel = "X-Achsen Beschriftung";
Blockly.Msg.senseBox_display_plotYLabel = "Y-Achsen Beschriftung";
Blockly.Msg.senseBox_display_plotXRange1 = "X-Wertebereich Anfang";
Blockly.Msg.senseBox_display_plotXRange2 = "X-Wertebereich Ende";
Blockly.Msg.senseBox_display_plotYRange1 = "Y-Wertebereich Anfang";
Blockly.Msg.senseBox_display_plotYRange2 = "Y-Wertebereich Ende";
Blockly.Msg.senseBox_display_plotXTick = "X-Linienabstand";
Blockly.Msg.senseBox_display_plotYTick = "Y-Linienabstand";
Blockly.Msg.senseBox_display_printDisplay_tooltip = "Mit diesem Block können automatisch Diagramme auf dem Display erstellt werden."
Blockly.Msg.senseBox_display_plotTimeFrame = "Zeitabschnitt";
Blockly.Msg.sensebox_display_fillCircle = "Zeichne Punkt";
Blockly.Msg.sensebox_display_fillCircle_radius = "Radius";
Blockly.Msg.senseBox_display_fillCircle_tooltip = "Mit diesem Block kann ein Punkt auf dem Display angezeigt werden. Über die Koordinaten kannst du den Punkt auf dem Display platzieren und mithilfe des Radius die Größe bestimmen."
Blockly.Msg.sensebox_display_drawRectangle = "Zeichne Rechteck";
Blockly.Msg.sensebox_display_drawRectangle_width = "Breite";
Blockly.Msg.sensebox_display_drawRectangle_height = "Höhe";
Blockly.Msg.senseBox_display_drawRectangle_tooltip = "Dieser Block zeichnet ein Rechteck auf das Display. Mit den X- und Y-Koordinaten wird die Position der oberen linken Ecke des Rechtecks auf dem Display bestimmt. Die Höhe und Breite wird in Pixeln angegeben und mit der Checkbox 'Ausgefüllt' kann ausgewählt werden ob das Rechteck ausgefüllt oder nur als Rahmen angezeigt wird."
Blockly.Msg.senseBox_display_filled = "Ausgefüllt";
Blockly.Msg.senseBox_display_fastPrint_show = "Zeige Messwerte";
Blockly.Msg.senseBox_display_fastPrint_title = "Titel";
Blockly.Msg.senseBox_display_fastPrint_value = "Messwert";
Blockly.Msg.senseBox_display_fastPrint_dimension = "Einheit";
Blockly.Msg.sensebox_display_fastPrint_tooltip = "Zeigt zwei Messwerte auf dem Display an. Wähle eine Überschrift für jeden Messwert und gib die Einheit an."
Blockly.Msg.senseBox_display_helpurl = "https://docs.sensebox.de/blockly/blockly-display/"
