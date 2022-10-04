const Blockly = {};
Blockly.Msg = {};

Blockly.Msg.ADD_COMMENT = "Kommentar hinzufügen";
Blockly.Msg.AUTH =
  "Bitte autorisiere diese App zum Aktivieren der Speicherung deiner Arbeit und zum Teilen.";
Blockly.Msg.CHANGE_VALUE_TITLE = "Wert ändern:";
Blockly.Msg.CHAT =
  "Chatte mit unserem Mitarbeiter durch Eingeben von Text in diesen Kasten!";
Blockly.Msg.CLEAN_UP = "Blöcke aufräumen";
Blockly.Msg.COLLAPSE_ALL = "Alle Blöcke zusammenfalten";
Blockly.Msg.COLLAPSE_BLOCK = "Block zusammenfalten";
Blockly.Msg.COLOUR_BLEND_COLOUR1 = "Farbe 1";
Blockly.Msg.COLOUR_BLEND_COLOUR2 = "mit Farbe 2";
Blockly.Msg.COLOUR_BLEND_HELPURL =
  "http://meyerweb.com/eric/tools/color-blend/";
Blockly.Msg.COLOUR_BLEND_RATIO = "im Verhältnis";
Blockly.Msg.COLOUR_BLEND_TITLE = "mische";
Blockly.Msg.COLOUR_BLEND_TOOLTIP =
  "Vermische 2 Farben mit konfigurierbaren Farbverhältnis (0.0 - 1.0).";
Blockly.Msg.COLOUR_PICKER_HELPURL = "https://de.wikipedia.org/wiki/Farbe";
Blockly.Msg.COLOUR_PICKER_TOOLTIP =
  "Wähle eine Farbe aus der Palette. Die Farbe wird automatisch in RGB-Werte konvertiert.";
Blockly.Msg.COLOUR_RANDOM_HELPURL = "http://randomcolour.com"; // untranslated
Blockly.Msg.COLOUR_RANDOM_TITLE = "zufällige Farbe";
Blockly.Msg.COLOUR_RANDOM_TOOLTIP =
  "Erstelle eine Farbe nach dem Zufallsprinzip.";
Blockly.Msg.COLOUR_RGB_BLUE = "blau";
Blockly.Msg.COLOUR_RGB_GREEN = "grün";
Blockly.Msg.COLOUR_RGB_HELPURL = "https://de.wikipedia.org/wiki/RGB-Farbraum";
Blockly.Msg.COLOUR_RGB_RED = "rot";
Blockly.Msg.COLOUR_RGB_TITLE = "Farbe mit";
Blockly.Msg.COLOUR_RGB_TOOLTIP =
  "Erstelle eine Farbe mit selbst definierten Rot-, Grün- und Blauwerten. Alle Werte müssen zwischen 0 und 255 liegen. 0 ist hierbei die geringte Intensität der Farbe 255 die höchste.";
Blockly.Msg.CONTROLS_FLOW_STATEMENTS_HELPURL =
  "https://de.wikipedia.org/wiki/Kontrollstruktur";
Blockly.Msg.CONTROLS_FLOW_STATEMENTS_OPERATOR_BREAK = "Die Schleife abbrechen";
Blockly.Msg.CONTROLS_FLOW_STATEMENTS_OPERATOR_CONTINUE =
  "mit der nächsten Iteration der Schleife fortfahren";
Blockly.Msg.CONTROLS_FLOW_STATEMENTS_TOOLTIP_BREAK =
  "Die umgebende Schleife beenden.";
Blockly.Msg.CONTROLS_FLOW_STATEMENTS_TOOLTIP_CONTINUE =
  "Diese Anweisung abbrechen und mit dem nächsten Schleifendurchlauf fortfahren.";
Blockly.Msg.CONTROLS_FLOW_STATEMENTS_WARNING =
  "Warnung: Dieser Block sollte nur in einer Schleife verwendet werden.";
Blockly.Msg.CONTROLS_FOREACH_HELPURL =
  "https://de.wikipedia.org/wiki/For-Schleife";
Blockly.Msg.CONTROLS_FOREACH_TITLE = "Für Wert %1 aus der Liste %2";
Blockly.Msg.CONTROLS_FOREACH_TOOLTIP =
  'Führe eine Anweisung für jeden Wert in der Liste aus und setzte dabei die Variable "%1" auf den aktuellen Listenwert.';
Blockly.Msg.CONTROLS_FOR_HELPURL = "https://de.wikipedia.org/wiki/For-Schleife";
Blockly.Msg.CONTROLS_FOR_TITLE = "Zähle %1 von %2 bis %3 mit %4";
Blockly.Msg.CONTROLS_FOR_TOOLTIP =
  'Zähle die Variable "%1" von einem Startwert bis zu einem Zielwert und führe für jeden Wert eine Anweisung aus.';
Blockly.Msg.CONTROLS_IF_ELSEIF_TOOLTIP = "Eine weitere Bedingung hinzufügen.";
Blockly.Msg.CONTROLS_IF_ELSE_TOOLTIP =
  "Eine sonst-Bedingung hinzufügen, führt eine Anweisung aus, falls keine Bedingung zutrifft.";
Blockly.Msg.CONTROLS_IF_HELPURL =
  "https://github.com/google/blockly/wiki/IfElse"; // untranslated
Blockly.Msg.CONTROLS_IF_IF_TOOLTIP =
  "Hinzufügen, entfernen oder sortieren von Sektionen";
Blockly.Msg.CONTROLS_IF_MSG_ELSE = "sonst";
Blockly.Msg.CONTROLS_IF_MSG_ELSEIF = "sonst wenn";
Blockly.Msg.CONTROLS_IF_MSG_IF = "wenn";
Blockly.Msg.CONTROLS_IF_TOOLTIP_1 =
  "Wenn eine Bedingung wahr (true) ist, dann führe eine Anweisung aus.";
Blockly.Msg.CONTROLS_IF_TOOLTIP_2 =
  "Wenn eine Bedingung wahr (true) ist, dann führe die erste Anweisung aus.  Ansonsten führe die zweite Anweisung aus.";
Blockly.Msg.CONTROLS_IF_TOOLTIP_3 =
  "Wenn die erste Bedingung wahr (true) ist, dann führe die erste Anweisung aus.  Oder wenn die zweite Bedingung wahr (true) ist, dann führe die zweite Anweisung aus.";
Blockly.Msg.CONTROLS_IF_TOOLTIP_4 =
  "Wenn die erste Bedingung wahr (true) ist, dann führe die erste Anweisung aus.  Oder wenn die zweite Bedingung wahr (true) ist, dann führe die zweite Anweisung aus.  Falls keine der beiden Bedingungen wahr (true) ist, dann führe die dritte Anweisung aus.";
Blockly.Msg.CONTROLS_REPEAT_HELPURL =
  "https://de.wikipedia.org/wiki/For-Schleife";
Blockly.Msg.CONTROLS_REPEAT_INPUT_DO = "mache";
Blockly.Msg.CONTROLS_REPEAT_TITLE = "Wiederhole %1 mal";
Blockly.Msg.CONTROLS_REPEAT_TOOLTIP = "Eine Anweisung mehrfach ausführen.";
Blockly.Msg.CONTROLS_WHILEUNTIL_HELPURL =
  "https://de.wikipedia.org/wiki/Schleife_%28Programmierung%29";
Blockly.Msg.CONTROLS_WHILEUNTIL_OPERATOR_UNTIL = "Wiederhole bis";
Blockly.Msg.CONTROLS_WHILEUNTIL_OPERATOR_WHILE = "Wiederhole solange";
Blockly.Msg.CONTROLS_WHILEUNTIL_TOOLTIP_UNTIL =
  "Führe die Anweisung solange aus wie die Bedingung falsch (false) ist.";
Blockly.Msg.CONTROLS_WHILEUNTIL_TOOLTIP_WHILE =
  "Führe die Anweisung solange aus wie die Bedingung wahr (true) ist.";
Blockly.Msg.DELETE_ALL_BLOCKS = "Alle %1 Bausteine löschen?";
Blockly.Msg.DELETE_BLOCK = "Block löschen";
Blockly.Msg.DELETE_X_BLOCKS = "Block %1 löschen";
Blockly.Msg.DISABLE_BLOCK = "Block deaktivieren";
Blockly.Msg.DUPLICATE_BLOCK = "Kopieren";
Blockly.Msg.ENABLE_BLOCK = "Block aktivieren";
Blockly.Msg.EXPAND_ALL = "Alle Blöcke entfalten";
Blockly.Msg.EXPAND_BLOCK = "Block entfalten";
Blockly.Msg.EXTERNAL_INPUTS = "externe Eingänge";
Blockly.Msg.HELP = "Hilfe";
Blockly.Msg.INLINE_INPUTS = "interne Eingänge";
Blockly.Msg.LISTS_CREATE_EMPTY_HELPURL =
  "https://github.com/google/blockly/wiki/Lists#create-empty-list";
Blockly.Msg.LISTS_CREATE_EMPTY_TITLE = "Erzeuge eine leere Liste";
Blockly.Msg.LISTS_CREATE_EMPTY_TOOLTIP =
  "Erzeugt eine leere Liste ohne Inhalt.";
Blockly.Msg.LISTS_CREATE_WITH_CONTAINER_TITLE_ADD = "Liste";
Blockly.Msg.LISTS_CREATE_WITH_CONTAINER_TOOLTIP =
  "Hinzufügen, entfernen und sortieren von Elementen.";
Blockly.Msg.LISTS_CREATE_WITH_HELPURL =
  "https://github.com/google/blockly/wiki/Lists#create-list-with";
Blockly.Msg.LISTS_CREATE_WITH_INPUT_WITH = "Erzeuge Liste mit";
Blockly.Msg.LISTS_CREATE_WITH_ITEM_TOOLTIP =
  "Ein Element zur Liste hinzufügen.";
Blockly.Msg.LISTS_CREATE_WITH_TOOLTIP =
  "Erzeugt eine List mit konfigurierten Elementen.";
Blockly.Msg.LISTS_GET_INDEX_FIRST = "erstes";
Blockly.Msg.LISTS_GET_INDEX_FROM_END = "#tes von hinten";
Blockly.Msg.LISTS_GET_INDEX_FROM_START = "#tes";
Blockly.Msg.LISTS_GET_INDEX_GET = "nimm";
Blockly.Msg.LISTS_GET_INDEX_GET_REMOVE = "nimm und entferne";
Blockly.Msg.LISTS_GET_INDEX_LAST = "letztes";
Blockly.Msg.LISTS_GET_INDEX_RANDOM = "zufälliges";
Blockly.Msg.LISTS_GET_INDEX_REMOVE = "entferne";
Blockly.Msg.LISTS_GET_INDEX_TAIL = "";
Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_FIRST =
  "Extrahiere das erste Element aus der Liste.";
Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_FROM_END =
  "Extrahiere das #1te Element aus Ende der Liste.";
Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_FROM_START =
  "Extrahiere das #1te Element aus der Liste.";
Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_LAST =
  "Extrahiere das letzte Element aus der Liste.";
Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_RANDOM =
  "Extrahiere ein zufälliges Element aus der Liste.";
Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_FIRST =
  "Extrahiere und entfernt das erste Element aus der Liste.";
Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_FROM_END =
  "Extrahiere und entfernt das #1te Element aus Ende der Liste.";
Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_FROM_START =
  "Extrahiere und entfernt das #1te Element aus der Liste.";
Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_LAST =
  "Extrahiere und entfernt das letzte Element aus der Liste.";
Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_RANDOM =
  "Extrahiere und entfernt ein zufälliges Element aus der Liste.";
Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_REMOVE_FIRST =
  "Entfernt das erste Element von der Liste.";
Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_REMOVE_FROM_END =
  "Entfernt das #1te Element von Ende der Liste.";
Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_REMOVE_FROM_START =
  "Entfernt das #1te Element von der Liste.";
Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_REMOVE_LAST =
  "Entfernt das letzte Element von der Liste.";
Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_REMOVE_RANDOM =
  "Entfernt ein zufälliges Element von der Liste.";
Blockly.Msg.LISTS_GET_SUBLIST_END_FROM_END = "bis zu # von hinten";
Blockly.Msg.LISTS_GET_SUBLIST_END_FROM_START = "bis zu #";
Blockly.Msg.LISTS_GET_SUBLIST_END_LAST = "bis zum Ende";
Blockly.Msg.LISTS_GET_SUBLIST_HELPURL =
  "http://publib.boulder.ibm.com/infocenter/lnxpcomp/v8v101/index.jsp?topic=%2Fcom.ibm.xlcpp8l.doc%2Flanguage%2Fref%2Farsubex.htm";
Blockly.Msg.LISTS_GET_SUBLIST_START_FIRST = "erhalte Unterliste vom Anfang";
Blockly.Msg.LISTS_GET_SUBLIST_START_FROM_END =
  "erhalte Unterliste von # von hinten";
Blockly.Msg.LISTS_GET_SUBLIST_START_FROM_START = "erhalte Unterliste von #";
Blockly.Msg.LISTS_GET_SUBLIST_TAIL = "";
Blockly.Msg.LISTS_GET_SUBLIST_TOOLTIP =
  "Erstellt eine Kopie mit dem angegebenen Abschnitt der Liste.";
Blockly.Msg.LISTS_INDEX_OF_FIRST = "suche erstes Auftreten von";
Blockly.Msg.LISTS_INDEX_OF_HELPURL =
  "http://publib.boulder.ibm.com/infocenter/lnxpcomp/v8v101/index.jsp?topic=%2Fcom.ibm.xlcpp8l.doc%2Flanguage%2Fref%2Farsubex.htm";
Blockly.Msg.LISTS_INDEX_OF_LAST = "suche letztes Auftreten von";
Blockly.Msg.LISTS_INDEX_OF_TOOLTIP =
  "Sucht die Position (index) eines Elementes in der Liste. Gibt 0 zurück, falls kein Element gefunden wurde.";
Blockly.Msg.LISTS_INLIST = "von der Liste";
Blockly.Msg.LISTS_ISEMPTY_HELPURL =
  "https://github.com/google/blockly/wiki/Lists#is-empty"; // untranslated
Blockly.Msg.LISTS_ISEMPTY_TITLE = "%1 ist leer?";
Blockly.Msg.LISTS_ISEMPTY_TOOLTIP = "Ist wahr (true), wenn die Liste leer ist.";
Blockly.Msg.LISTS_LENGTH_HELPURL =
  "https://github.com/google/blockly/wiki/Lists#length-of"; // untranslated
Blockly.Msg.LISTS_LENGTH_TITLE = "Länge von %1";
Blockly.Msg.LISTS_LENGTH_TOOLTIP = "Die Anzahl von Elementen in der Liste.";
Blockly.Msg.LISTS_REPEAT_HELPURL =
  "http://publib.boulder.ibm.com/infocenter/lnxpcomp/v8v101/index.jsp?topic=%2Fcom.ibm.xlcpp8l.doc%2Flanguage%2Fref%2Farsubex.htm";
Blockly.Msg.LISTS_REPEAT_TITLE =
  "Erzeuge Liste mit Element %1 wiederhole es %2 mal";
Blockly.Msg.LISTS_REPEAT_TOOLTIP =
  "Erzeugt eine Liste mit einer variablen Anzahl von Elementen";
Blockly.Msg.LISTS_SET_INDEX_HELPURL =
  "http://publib.boulder.ibm.com/infocenter/lnxpcomp/v8v101/index.jsp?topic=%2Fcom.ibm.xlcpp8l.doc%2Flanguage%2Fref%2Farsubex.htm";
Blockly.Msg.LISTS_SET_INDEX_INPUT_TO = "ein";
Blockly.Msg.LISTS_SET_INDEX_INSERT = "füge";
Blockly.Msg.LISTS_SET_INDEX_SET = "setze";
Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_INSERT_FIRST =
  "Fügt das Element an den Anfang der Liste an.";
Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_INSERT_FROM_END =
  "Fügt das Element an der angegebenen Position in der Liste ein.  #1 ist das letzte Element.";
Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_INSERT_FROM_START =
  "Fügt das Element an der angegebenen Position in der Liste ein.  #1 ist die erste Element.";
Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_INSERT_LAST =
  "Fügt das Element ans Ende der Liste an.";
Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_INSERT_RANDOM =
  "Fügt das Element zufällig in die Liste ein.";
Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_SET_FIRST =
  "Setzt das erste Element in der Liste.";
Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_SET_FROM_END =
  "Setzt das Element an der angegebenen Position in der Liste.  #1 ist das letzte Element.";
Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_SET_FROM_START =
  "Setzte das Element an der angegebenen Position in der Liste.  #1 ist das erste Element.";
Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_SET_LAST =
  "Setzt das letzte Element in der Liste.";
Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_SET_RANDOM =
  "Setzt ein zufälliges Element in der Liste.";
Blockly.Msg.LISTS_SORT_HELPURL =
  "https://github.com/google/blockly/wiki/Lists#sorting-a-list";
Blockly.Msg.LISTS_SORT_ORDER_ASCENDING = "aufsteigend";
Blockly.Msg.LISTS_SORT_ORDER_DESCENDING = "absteigend";
Blockly.Msg.LISTS_SORT_TITLE = "%1 %2 %3 sortieren";
Blockly.Msg.LISTS_SORT_TOOLTIP = "Eine Kopie einer Liste sortieren.";
Blockly.Msg.LISTS_SORT_TYPE_IGNORECASE = "alphabetisch, Schreibung ignorieren";
Blockly.Msg.LISTS_SORT_TYPE_NUMERIC = "numerisch";
Blockly.Msg.LISTS_SORT_TYPE_TEXT = "alphabetisch";
Blockly.Msg.LISTS_SPLIT_HELPURL =
  "https://github.com/google/blockly/wiki/Lists#splitting-strings-and-joining-lists";
Blockly.Msg.LISTS_SPLIT_LIST_FROM_TEXT = "Liste aus Text erstellen";
Blockly.Msg.LISTS_SPLIT_TEXT_FROM_LIST = "Text aus Liste erstellen";
Blockly.Msg.LISTS_SPLIT_TOOLTIP_JOIN =
  "Liste mit Texten in einen Text vereinen, getrennt durch ein Trennzeichen.";
Blockly.Msg.LISTS_SPLIT_TOOLTIP_SPLIT =
  "Text in eine Liste mit Texten aufteilen, unterbrochen bei jedem Trennzeichen.";
Blockly.Msg.LISTS_SPLIT_WITH_DELIMITER = "mit Trennzeichen";
Blockly.Msg.LOGIC_BOOLEAN_FALSE = "falsch";
Blockly.Msg.LOGIC_BOOLEAN_HELPURL =
  "https://github.com/google/blockly/wiki/Logic#values"; // untranslated
Blockly.Msg.LOGIC_BOOLEAN_TOOLTIP =
  "Ist entweder wahr (true) oder falsch (false)";
Blockly.Msg.LOGIC_BOOLEAN_TRUE = "wahr";
Blockly.Msg.LOGIC_COMPARE_HELPURL =
  "https://de.wikipedia.org/wiki/Vergleich_%28Zahlen%29";
Blockly.Msg.LOGIC_COMPARE_TOOLTIP_EQ =
  "Ist wahr (true), wenn beide Werte gleich sind.";
Blockly.Msg.LOGIC_COMPARE_TOOLTIP_GT =
  "Ist wahr (true), wenn der erste Wert größer als der zweite Wert ist.";
Blockly.Msg.LOGIC_COMPARE_TOOLTIP_GTE =
  "Ist wahr (true), wenn der erste Wert größer als oder gleich groß wie der zweite Wert ist.";
Blockly.Msg.LOGIC_COMPARE_TOOLTIP_LT =
  "Ist wahr (true), wenn der erste Wert kleiner als der zweite Wert ist.";
Blockly.Msg.LOGIC_COMPARE_TOOLTIP_LTE =
  "Ist wahr (true), wenn der erste Wert kleiner als oder gleich groß wie der zweite Wert ist.";
Blockly.Msg.LOGIC_COMPARE_TOOLTIP_NEQ =
  "Ist wahr (true), wenn beide Werte unterschiedlich sind.";
Blockly.Msg.LOGIC_NEGATE_HELPURL =
  "https://github.com/google/blockly/wiki/Logic#not"; // untranslated
Blockly.Msg.LOGIC_NEGATE_TITLE = "nicht %1";
Blockly.Msg.LOGIC_NEGATE_TOOLTIP =
  "Ist wahr (true), wenn der Eingabewert falsch (false) ist.  Ist falsch (false), wenn der Eingabewert wahr (true) ist.";
Blockly.Msg.LOGIC_NULL = "null";
Blockly.Msg.LOGIC_NULL_HELPURL = "https://de.wikipedia.org/wiki/Nullwert";
Blockly.Msg.LOGIC_NULL_TOOLTIP = "Ist NULL.";
Blockly.Msg.LOGIC_OPERATION_AND = "und";
Blockly.Msg.LOGIC_OPERATION_HELPURL =
  "https://github.com/google/blockly/wiki/Logic#logical-operations"; // untranslated
Blockly.Msg.LOGIC_OPERATION_OR = "oder";
Blockly.Msg.LOGIC_OPERATION_TOOLTIP_AND =
  "Ist wahr (true), wenn beide Werte wahr (true) sind.";
Blockly.Msg.LOGIC_OPERATION_TOOLTIP_OR =
  "Ist wahr (true), wenn einer der beiden Werte wahr (true) ist.";
Blockly.Msg.LOGIC_TERNARY_CONDITION = "teste";
Blockly.Msg.LOGIC_TERNARY_HELPURL =
  "https://de.wikipedia.org/wiki/%3F:#Auswahloperator";
Blockly.Msg.LOGIC_TERNARY_IF_FALSE = "wenn falsch";
Blockly.Msg.LOGIC_TERNARY_IF_TRUE = "wenn wahr";
Blockly.Msg.LOGIC_TERNARY_TOOLTIP =
  'Überprüft eine Bedingung "teste". Wenn die Bedingung wahr ist, wird der "wenn wahr" Wert zurückgegeben, andernfalls der "wenn falsch" Wert';
Blockly.Msg.MATH_ADDITION_SYMBOL = "+"; // untranslated
Blockly.Msg.MATH_ARITHMETIC_HELPURL =
  "https://de.wikipedia.org/wiki/Grundrechenart";
Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_ADD = "Ist die Summe zweier Werte.";
Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_DIVIDE = "Ist der Quotient zweier Werte.";
Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_MINUS = "Ist die Differenz zweier Werte.";
Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_MULTIPLY = "Ist das Produkt zweier Werte.";
Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_POWER =
  "Ist der erste Wert potenziert mit dem zweiten Wert.";
Blockly.Msg.MATH_CHANGE_HELPURL =
  "https://de.wikipedia.org/wiki/Inkrement_und_Dekrement";
Blockly.Msg.MATH_CHANGE_TITLE = "erhöhe %1 um %2";
Blockly.Msg.MATH_CHANGE_TOOLTIP = 'Addiert einen Wert zur Variable "%1" hinzu.';
Blockly.Msg.MATH_CONSTANT_HELPURL =
  "https://de.wikipedia.org/wiki/Mathematische_Konstante";
Blockly.Msg.MATH_CONSTANT_TOOLTIP =
  "Mathematische Konstanten wie: π (3.141…), e (2.718…), φ (1.618…), sqrt(2) (1.414…), sqrt(½) (0.707…) oder ∞ (unendlich).";
Blockly.Msg.MATH_CONSTRAIN_HELPURL =
  "https://en.wikipedia.org/wiki/Clamping_%28graphics%29"; // untranslated
Blockly.Msg.MATH_CONSTRAIN_TITLE = "begrenze %1 von %2 bis %3";
Blockly.Msg.MATH_CONSTRAIN_TOOLTIP =
  'Begrenzt den Wertebereich auf den "von"-Wert bis einschließlich zum "bis"-Wert. (inklusiv)';
Blockly.Msg.MATH_DIVISION_SYMBOL = "÷"; // untranslated
Blockly.Msg.MATH_IS_DIVISIBLE_BY = "ist teilbar durch";
Blockly.Msg.MATH_IS_EVEN = "ist gerade";
Blockly.Msg.MATH_IS_NEGATIVE = "ist negativ";
Blockly.Msg.MATH_IS_ODD = "ist ungerade";
Blockly.Msg.MATH_IS_POSITIVE = "ist positiv";
Blockly.Msg.MATH_IS_PRIME = "ist eine Primzahl";
Blockly.Msg.MATH_IS_TOOLTIP =
  "Überprüft ob eine Zahl gerade, ungerade, eine Primzahl, ganzzahlig, positiv, negativ oder durch eine zweite Zahl teilbar ist.  Gibt wahr (true) oder falsch (false) zurück.";
Blockly.Msg.MATH_IS_WHOLE = "ist eine ganze Zahl";
Blockly.Msg.MATH_MODULO_HELPURL = "https://de.wikipedia.org/wiki/Modulo";
Blockly.Msg.MATH_MODULO_TITLE = "Rest von %1 ÷ %2";
Blockly.Msg.MATH_MODULO_TOOLTIP = "Der Rest nach einer Division.";
Blockly.Msg.MATH_MULTIPLICATION_SYMBOL = "×";
Blockly.Msg.MATH_NUMBER_HELPURL = "https://de.wikipedia.org/wiki/Zahl";
Blockly.Msg.MATH_NUMBER_TOOLTIP = "Eine Zahl.";
Blockly.Msg.MATH_ONLIST_HELPURL =
  "http://www.sysplus.ch/einstieg.php?links=menu&seite=4125&grad=Crash&prog=Excel";
Blockly.Msg.MATH_ONLIST_OPERATOR_AVERAGE = "Mittelwert einer Liste";
Blockly.Msg.MATH_ONLIST_OPERATOR_MAX = "Maximalwert einer Liste";
Blockly.Msg.MATH_ONLIST_OPERATOR_MEDIAN = "Median einer Liste";
Blockly.Msg.MATH_ONLIST_OPERATOR_MIN = "Minimalwert einer Liste";
Blockly.Msg.MATH_ONLIST_OPERATOR_MODE = "am häufigsten in Liste";
Blockly.Msg.MATH_ONLIST_OPERATOR_RANDOM = "Zufallswert einer Liste";
Blockly.Msg.MATH_ONLIST_OPERATOR_STD_DEV = "Standardabweichung einer Liste";
Blockly.Msg.MATH_ONLIST_OPERATOR_SUM = "Summe einer Liste";
Blockly.Msg.MATH_ONLIST_TOOLTIP_AVERAGE =
  "Ist der Durchschnittswert aller Werte in einer Liste.";
Blockly.Msg.MATH_ONLIST_TOOLTIP_MAX = "Ist der größte Wert in einer Liste.";
Blockly.Msg.MATH_ONLIST_TOOLTIP_MEDIAN =
  "Ist der Median aller Werte in einer Liste.";
Blockly.Msg.MATH_ONLIST_TOOLTIP_MIN = "Ist der kleinste Wert in einer Liste.";
Blockly.Msg.MATH_ONLIST_TOOLTIP_MODE =
  "Findet den am häufigsten vorkommenden Wert in einer Liste.  Falls kein Wert öfter vorkommt als alle anderen, wird die originale Liste zurückgeben";
Blockly.Msg.MATH_ONLIST_TOOLTIP_RANDOM =
  "Gebe einen zufälligen Wert aus der Liste zurück.";
Blockly.Msg.MATH_ONLIST_TOOLTIP_STD_DEV =
  "Ist die standardisierte Standardabweichung aller Werte in der Liste";
Blockly.Msg.MATH_ONLIST_TOOLTIP_SUM =
  "Ist die Summe aller Werte in einer Liste.";
Blockly.Msg.MATH_POWER_SYMBOL = "^";
Blockly.Msg.MATH_RANDOM_FLOAT_HELPURL =
  "https://de.wikipedia.org/wiki/Zufallszahlen";
Blockly.Msg.MATH_RANDOM_FLOAT_TITLE_RANDOM = "Zufallszahl (0.0 -1.0)";
Blockly.Msg.MATH_RANDOM_FLOAT_TOOLTIP =
  "Erzeuge eine Zufallszahl zwischen 0.0 (inklusiv) und 1.0 (exklusiv).";
Blockly.Msg.MATH_RANDOM_INT_HELPURL =
  "https://de.wikipedia.org/wiki/Zufallszahlen";
Blockly.Msg.MATH_RANDOM_INT_TITLE =
  "ganzzahliger Zufallswert zwischen %1 bis %2";
Blockly.Msg.MATH_RANDOM_INT_TOOLTIP =
  "Erzeuge einen ganzzahligen Zufallswert zwischen zwei Werten (inklusiv).";
Blockly.Msg.MATH_ROUND_HELPURL = "https://de.wikipedia.org/wiki/Runden";
Blockly.Msg.MATH_ROUND_OPERATOR_ROUND = "runden";
Blockly.Msg.MATH_ROUND_OPERATOR_ROUNDDOWN = "abrunden";
Blockly.Msg.MATH_ROUND_OPERATOR_ROUNDUP = "aufrunden";
Blockly.Msg.MATH_ROUND_TOOLTIP = "Eine Zahl auf- oder abrunden.";
Blockly.Msg.MATH_SINGLE_HELPURL = "https://de.wikipedia.org/wiki/Quadratwurzel";
Blockly.Msg.MATH_SINGLE_OP_ABSOLUTE = "Absolutwert";
Blockly.Msg.MATH_SINGLE_OP_ROOT = "Quadratwurzel";
Blockly.Msg.MATH_SINGLE_TOOLTIP_ABS = "Ist der Absolutwert eines Wertes.";
Blockly.Msg.MATH_SINGLE_TOOLTIP_EXP =
  "Ist Wert der Exponentialfunktion eines Wertes.";
Blockly.Msg.MATH_SINGLE_TOOLTIP_LN =
  "Ist der natürliche Logarithmus eines Wertes.";
Blockly.Msg.MATH_SINGLE_TOOLTIP_LOG10 =
  "Ist der dekadische Logarithmus eines Wertes.";
Blockly.Msg.MATH_SINGLE_TOOLTIP_NEG = "Negiert einen Wert.";
Blockly.Msg.MATH_SINGLE_TOOLTIP_POW10 = "Rechnet 10 hoch Eingabewert.";
Blockly.Msg.MATH_SINGLE_TOOLTIP_ROOT = "Ist die Quadratwurzel eines Wertes.";
Blockly.Msg.MATH_SUBTRACTION_SYMBOL = "-";
Blockly.Msg.MATH_TRIG_ACOS = "acos";
Blockly.Msg.MATH_TRIG_ASIN = "asin";
Blockly.Msg.MATH_TRIG_ATAN = "atan";
Blockly.Msg.MATH_TRIG_COS = "cos";
Blockly.Msg.MATH_TRIG_HELPURL = "https://de.wikipedia.org/wiki/Trigonometrie";
Blockly.Msg.MATH_TRIG_SIN = "sin";
Blockly.Msg.MATH_TRIG_TAN = "tan";
Blockly.Msg.MATH_TRIG_TOOLTIP_ACOS = "Ist der Arkuskosinus des Eingabewertes.";
Blockly.Msg.MATH_TRIG_TOOLTIP_ASIN = "Ist der Arkussinus des Eingabewertes.";
Blockly.Msg.MATH_TRIG_TOOLTIP_ATAN = "Ist der Arkustangens des Eingabewertes.";
Blockly.Msg.MATH_TRIG_TOOLTIP_COS = "Ist der Kosinus des Winkels.";
Blockly.Msg.MATH_TRIG_TOOLTIP_SIN = "Ist der Sinus des Winkels.";
Blockly.Msg.MATH_TRIG_TOOLTIP_TAN = "Ist der Tangens des Winkels.";
Blockly.Msg.ME = "Ich";
Blockly.Msg.NEW_VARIABLE = "Neue Variable...";
Blockly.Msg.NEW_VARIABLE_TITLE = "Name der neuen Variable:";
Blockly.Msg.ORDINAL_NUMBER_SUFFIX = "";
Blockly.Msg.PROCEDURES_ALLOW_STATEMENTS = "Aussagen erlauben";
Blockly.Msg.PROCEDURES_BEFORE_PARAMS = "mit:";
Blockly.Msg.PROCEDURES_CALLNORETURN_HELPURL =
  "https://de.wikipedia.org/wiki/Prozedur_%28Programmierung%29";
Blockly.Msg.PROCEDURES_CALLNORETURN_TOOLTIP =
  "Rufe einen Funktionsblock ohne Rückgabewert auf.";
Blockly.Msg.PROCEDURES_CALLRETURN_HELPURL =
  "https://de.wikipedia.org/wiki/Prozedur_%28Programmierung%29";
Blockly.Msg.PROCEDURES_CALLRETURN_TOOLTIP =
  "Rufe einen Funktionsblock mit Rückgabewert auf.";
Blockly.Msg.PROCEDURES_CALL = "Rufe";
Blockly.Msg.PROCEDURES_CALL_END = "auf";
Blockly.Msg.PROCEDURES_DEFNORETURN = "Erstelle Funktion";
Blockly.Msg.PROCEDURES_BEFORE_PARAMS = "mit Eingabeparameter:";
Blockly.Msg.PROCEDURES_DEFRETURN_RETURN_TYPE = "Rückgabetype";
Blockly.Msg.PROCEDURES_CALL_BEFORE_PARAMS = "mit:";
Blockly.Msg.PROCEDURES_CREATE_DO = 'Erzeuge "Aufruf %1"';
Blockly.Msg.PROCEDURES_DEFNORETURN_COMMENT = "Beschreibe diese Funktion …";
Blockly.Msg.PROCEDURES_DEFNORETURN_DO = "";
Blockly.Msg.PROCEDURES_DEFNORETURN_HELPURL =
  "https://de.wikipedia.org/wiki/Prozedur_%28Programmierung%29";
Blockly.Msg.PROCEDURES_DEFNORETURN_PROCEDURE = "Funktionsblock";
Blockly.Msg.PROCEDURES_DEFNORETURN_TITLE = "zu";
Blockly.Msg.PROCEDURES_DEFNORETURN_TOOLTIP =
  "Ein Funktionsblock ohne Rückgabewert.";
Blockly.Msg.PROCEDURES_DEFRETURN_HELPURL =
  "https://de.wikipedia.org/wiki/Prozedur_%28Programmierung%29";
Blockly.Msg.PROCEDURES_DEFRETURN_RETURN = "gebe zurück";
Blockly.Msg.PROCEDURES_DEFRETURN_TOOLTIP =
  "Ein Funktionsblock mit Rückgabewert.";
Blockly.Msg.PROCEDURES_DEF_DUPLICATE_WARNING =
  "Warnung: dieser Funktionsblock hat zwei gleich benannte Parameter.";
Blockly.Msg.PROCEDURES_HIGHLIGHT_DEF = "Markiere Funktionsblock";
Blockly.Msg.PROCEDURES_IFRETURN_HELPURL = "http://c2.com/cgi/wiki?GuardClause";
Blockly.Msg.PROCEDURES_IFRETURN_TOOLTIP =
  "Wenn der erste Wert wahr (true) ist, Gebe den zweiten Wert zurück.";
Blockly.Msg.PROCEDURES_IFRETURN_WARNING =
  "Warnung: Dieser Block darf nur innerhalb eines Funktionsblock genutzt werden.";
Blockly.Msg.PROCEDURES_MUTATORARG_TITLE = "Variable:";
Blockly.Msg.PROCEDURES_MUTATORARG_TOOLTIP =
  "Eine Eingabe zur Funktion hinzufügen.";
Blockly.Msg.PROCEDURES_MUTATORCONTAINER_TITLE = "Parameter";
Blockly.Msg.PROCEDURES_MUTATORCONTAINER_TOOLTIP =
  "Die Eingaben zu dieser Funktion hinzufügen, entfernen oder neu anordnen.";
Blockly.Msg.REDO = "Wiederholen";
Blockly.Msg.REMOVE_COMMENT = "Kommentar entfernen";
Blockly.Msg.RENAME_VARIABLE = "Variable umbenennen...";
Blockly.Msg.RENAME_VARIABLE_TITLE = 'Alle "%1" Variablen umbenennen in:';
Blockly.Msg.TEXT_APPEND_APPENDTEXT = "Text anhängen";
Blockly.Msg.TEXT_APPEND_HELPURL =
  "https://github.com/google/blockly/wiki/Text#text-modification"; // untranslated
Blockly.Msg.TEXT_APPEND_TO = "An";
Blockly.Msg.TEXT_APPEND_TOOLTIP = 'Text an die Variable "%1" anhängen.';
Blockly.Msg.TEXT_CHANGECASE_HELPURL =
  "https://github.com/google/blockly/wiki/Text#adjusting-text-case"; // untranslated
Blockly.Msg.TEXT_CHANGECASE_OPERATOR_LOWERCASE = "umwandeln in kleinbuchstaben";
Blockly.Msg.TEXT_CHANGECASE_OPERATOR_TITLECASE = "umwandeln in Substantive";
Blockly.Msg.TEXT_CHANGECASE_OPERATOR_UPPERCASE = "umwandeln in GROSSBUCHSTABEN";
Blockly.Msg.TEXT_CHANGECASE_TOOLTIP =
  "Wandelt Schreibweise von Texten um, in Großbuchstaben, Kleinbuchstaben oder den ersten Buchstaben jedes Wortes groß und die anderen klein.";
Blockly.Msg.TEXT_CHARAT_FIRST = "Nehme ersten Buchstaben";
Blockly.Msg.TEXT_CHARAT_FROM_END = "Nehme #ten Buchstaben von hinten";
Blockly.Msg.TEXT_CHARAT_FROM_START = "Nehme #ten Buchstaben";
Blockly.Msg.TEXT_CHARAT_HELPURL =
  "http://publib.boulder.ibm.com/infocenter/lnxpcomp/v8v101/index.jsp?topic=%2Fcom.ibm.xlcpp8l.doc%2Flanguage%2Fref%2Farsubex.htm";
Blockly.Msg.TEXT_CHARAT_INPUT_INTEXT = "vom Text";
Blockly.Msg.TEXT_CHARAT_LAST = "Nehme letzten Buchstaben";
Blockly.Msg.TEXT_CHARAT_RANDOM = "Nehme zufälligen Buchstaben";
Blockly.Msg.TEXT_CHARAT_TAIL = "";
Blockly.Msg.TEXT_CHARAT_TOOLTIP =
  "Extrahiere einen Buchstaben von einer spezifizierten Position.";
Blockly.Msg.TEXT_CREATE_JOIN_ITEM_TOOLTIP = "Ein Element zum Text hinzufügen.";
Blockly.Msg.TEXT_CREATE_JOIN_TITLE_JOIN = "verbinden";
Blockly.Msg.TEXT_CREATE_JOIN_TOOLTIP =
  "Hinzufügen, entfernen und sortieren von Elementen.";
Blockly.Msg.TEXT_GET_SUBSTRING_END_FROM_END =
  "bis zum #ten Buchstaben von hinten";
Blockly.Msg.TEXT_GET_SUBSTRING_END_FROM_START = "bis zum #ten Buchstaben";
Blockly.Msg.TEXT_GET_SUBSTRING_END_LAST = "bis zum letzten Buchstaben";
Blockly.Msg.TEXT_GET_SUBSTRING_HELPURL =
  "http://publib.boulder.ibm.com/infocenter/lnxpcomp/v8v101/index.jsp?topic=%2Fcom.ibm.xlcpp8l.doc%2Flanguage%2Fref%2Farsubex.htm";
Blockly.Msg.TEXT_GET_SUBSTRING_INPUT_IN_TEXT = "in Text";
Blockly.Msg.TEXT_GET_SUBSTRING_START_FIRST = "vom ersten Buchstaben";
Blockly.Msg.TEXT_GET_SUBSTRING_START_FROM_END =
  "vom #ten Buchstaben von hinten";
Blockly.Msg.TEXT_GET_SUBSTRING_START_FROM_START = "vom #ten Buchstaben";
Blockly.Msg.TEXT_GET_SUBSTRING_TAIL = "";
Blockly.Msg.TEXT_GET_SUBSTRING_TOOLTIP =
  "Gibt den angegebenen Textabschnitt zurück.";
Blockly.Msg.TEXT_INDEXOF_HELPURL =
  "http://publib.boulder.ibm.com/infocenter/lnxpcomp/v8v101/index.jsp?topic=%2Fcom.ibm.xlcpp8l.doc%2Flanguage%2Fref%2Farsubex.htm";
Blockly.Msg.TEXT_INDEXOF_INPUT_INTEXT = "im Text";
Blockly.Msg.TEXT_INDEXOF_OPERATOR_FIRST = "Suche erstes Auftreten des Begriffs";
Blockly.Msg.TEXT_INDEXOF_OPERATOR_LAST = "Suche letztes Auftreten des Begriffs";
Blockly.Msg.TEXT_INDEXOF_TAIL = "";
Blockly.Msg.TEXT_INDEXOF_TOOLTIP =
  "Findet das erste / letzte Auftreten eines Suchbegriffs in einem Text.  Gibt die Position des Begriffs oder 0 zurück.";
Blockly.Msg.TEXT_ISEMPTY_HELPURL =
  "https://github.com/google/blockly/wiki/Text#checking-for-empty-text"; // untranslated
Blockly.Msg.TEXT_ISEMPTY_TITLE = "%1 ist leer?";
Blockly.Msg.TEXT_ISEMPTY_TOOLTIP =
  "Ist wahr (true), wenn der Text keine Zeichen enthält ist.";
Blockly.Msg.TEXT_JOIN_HELPURL = "";
Blockly.Msg.TEXT_JOIN_TITLE_CREATEWITH = "Erstelle Text aus";
Blockly.Msg.TEXT_JOIN_TOOLTIP =
  "Erstellt einen Text durch das Verbinden von mehreren Textelementen.";
Blockly.Msg.TEXT_LENGTH_HELPURL =
  "https://github.com/google/blockly/wiki/Text#text-modification"; // untranslated
Blockly.Msg.TEXT_LENGTH_TITLE = "Länge %1";
Blockly.Msg.TEXT_LENGTH_TOOLTIP =
  "Die Anzahl von Zeichen in einem Text. (inkl. Leerzeichen)";
Blockly.Msg.TEXT_PRINT_HELPURL =
  "https://github.com/google/blockly/wiki/Text#printing-text"; // untranslated
Blockly.Msg.TEXT_PRINT_TITLE = "Ausgabe %1";
Blockly.Msg.TEXT_PRINT_TOOLTIP = "Gib den Inhalt einer Variable aus.";
Blockly.Msg.TEXT_PROMPT_HELPURL =
  "https://github.com/google/blockly/wiki/Text#getting-input-from-the-user"; // untranslated
Blockly.Msg.TEXT_PROMPT_TOOLTIP_NUMBER = "Fragt den Benutzer nach einer Zahl.";
Blockly.Msg.TEXT_PROMPT_TOOLTIP_TEXT = "Fragt den Benutzer nach einem Text.";
Blockly.Msg.TEXT_PROMPT_TYPE_NUMBER = "Fragt nach Zahl mit Hinweis";
Blockly.Msg.TEXT_PROMPT_TYPE_TEXT = "Fragt nach Text mit Hinweis";
Blockly.Msg.TEXT_TEXT_HELPURL = "https://de.wikipedia.org/wiki/Zeichenkette";
Blockly.Msg.TEXT_TEXT_TOOLTIP = "Ein Buchstabe, Text oder Satz.";
Blockly.Msg.TEXT_TRIM_HELPURL =
  "https://github.com/google/blockly/wiki/Text#trimming-removing-spaces"; // untranslated
Blockly.Msg.TEXT_TRIM_OPERATOR_BOTH =
  "entferne Leerzeichen vom Anfang und vom Ende (links und rechts)";
Blockly.Msg.TEXT_TRIM_OPERATOR_LEFT = "entferne Leerzeichen vom Anfang (links)";
Blockly.Msg.TEXT_TRIM_OPERATOR_RIGHT = "entferne Leerzeichen vom Ende (rechts)";
Blockly.Msg.TEXT_TRIM_TOOLTIP =
  "Entfernt Leerzeichen vom Anfang und / oder Ende eines Textes.";
Blockly.Msg.TODAY = "Heute";
Blockly.Msg.UNDO = "Rückgängig";
Blockly.Msg.VARIABLES_DEFAULT_NAME = "Element";
Blockly.Msg.VARIABLES_GET_CREATE_SET = 'Erzeuge "Schreibe %1"';
Blockly.Msg.VARIABLES_GET_HELPURL =
  "https://de.wikipedia.org/wiki/Variable_%28Programmierung%29";
Blockly.Msg.VARIABLES_GET_TOOLTIP = "Gibt den Wert der Variable zurück.";
Blockly.Msg.VARIABLES_SET = "Schreibe %1 %2";
Blockly.Msg.VARIABLES_SET_CREATE_GET = 'Erzeuge "Lese %1"';
Blockly.Msg.VARIABLES_SET_HELPURL =
  "https://de.wikipedia.org/wiki/Variable_%28Programmierung%29";
Blockly.Msg.VARIABLES_SET_TOOLTIP = "Setzt den Wert einer Variable.";
Blockly.Msg.MATH_CHANGE_TITLE_ITEM = Blockly.Msg.VARIABLES_DEFAULT_NAME;
Blockly.Msg.PROCEDURES_DEFRETURN_TITLE =
  Blockly.Msg.PROCEDURES_DEFNORETURN_TITLE;
Blockly.Msg.CONTROLS_IF_IF_TITLE_IF = Blockly.Msg.CONTROLS_IF_MSG_IF;
Blockly.Msg.CONTROLS_WHILEUNTIL_INPUT_DO = Blockly.Msg.CONTROLS_REPEAT_INPUT_DO;
Blockly.Msg.CONTROLS_IF_MSG_THEN = Blockly.Msg.CONTROLS_REPEAT_INPUT_DO;
Blockly.Msg.CONTROLS_IF_ELSE_TITLE_ELSE = Blockly.Msg.CONTROLS_IF_MSG_ELSE;
Blockly.Msg.PROCEDURES_DEFRETURN_PROCEDURE =
  Blockly.Msg.PROCEDURES_DEFNORETURN_PROCEDURE;
Blockly.Msg.LISTS_GET_SUBLIST_INPUT_IN_LIST = Blockly.Msg.LISTS_INLIST;
Blockly.Msg.LISTS_GET_INDEX_INPUT_IN_LIST = Blockly.Msg.LISTS_INLIST;
Blockly.Msg.PROCEDURES_DEFRETURN_DO = Blockly.Msg.PROCEDURES_DEFNORETURN_DO;
Blockly.Msg.CONTROLS_IF_ELSEIF_TITLE_ELSEIF =
  Blockly.Msg.CONTROLS_IF_MSG_ELSEIF;
Blockly.Msg.LISTS_GET_INDEX_HELPURL = Blockly.Msg.LISTS_INDEX_OF_HELPURL;
Blockly.Msg.CONTROLS_FOREACH_INPUT_DO = Blockly.Msg.CONTROLS_REPEAT_INPUT_DO;
Blockly.Msg.LISTS_SET_INDEX_INPUT_IN_LIST = Blockly.Msg.LISTS_INLIST;
Blockly.Msg.CONTROLS_FOR_INPUT_DO = Blockly.Msg.CONTROLS_REPEAT_INPUT_DO;
Blockly.Msg.LISTS_CREATE_WITH_ITEM_TITLE = Blockly.Msg.VARIABLES_DEFAULT_NAME;
Blockly.Msg.TEXT_APPEND_VARIABLE = Blockly.Msg.VARIABLES_DEFAULT_NAME;
Blockly.Msg.TEXT_CREATE_JOIN_ITEM_TITLE_ITEM =
  Blockly.Msg.VARIABLES_DEFAULT_NAME;
Blockly.Msg.LISTS_INDEX_OF_INPUT_IN_LIST = Blockly.Msg.LISTS_INLIST;
Blockly.Msg.PROCEDURES_DEFRETURN_COMMENT =
  Blockly.Msg.PROCEDURES_DEFNORETURN_COMMENT;

// Ardublockly strings
Blockly.Msg.ARD_ANALOGREAD = "lese analogen Pin#";
Blockly.Msg.ARD_ANALOGREAD_TIP = "Gibt einen Wert zwischen 0 und 1024 zurüch";
Blockly.Msg.ARD_ANALOGWRITE = "setzte analogen Pin#";
Blockly.Msg.ARD_ANALOGWRITE_TIP =
  "Schreibe analogen Wert zwischen 0 und 255 an einen spezifischen PWM Port";
Blockly.Msg.ARD_BUILTIN_LED = "eingebaute LED";
Blockly.Msg.ARD_BUILTIN_LED_TIP = "Schaltet die interne LED An oder Aus";
Blockly.Msg.ARD_COMPONENT_WARN1 =
  "A %1 configuration block with the same %2 name must be added to use this block!";
Blockly.Msg.ARD_DEFINE = "Definiere";
Blockly.Msg.ARD_DIGITALREAD = "lesen digitalen Pin#";
Blockly.Msg.ARD_DIGITALREAD_TIP =
  "Lese Wert an digitalen Pin: HIGH(1) oder LOW(0)";
Blockly.Msg.ARD_DIGITALWRITE = "setzte digitalen Pin#";
Blockly.Msg.ARD_DIGITALWRITE_TIP =
  "Schreibe digitalen Wert HIGH (1) oder LOW(0) an spezifischen Port";
Blockly.Msg.ARD_FUN_RUN_LOOP = "Endlosschleife()";
Blockly.Msg.ARD_FUN_RUN_SETUP = "Setup()";
Blockly.Msg.ARD_FUN_RUN_TIP =
  "Definiert die setup() und loop() Funktionen. Die setup()-Funktion wird beim starten **einmal** ausgeführt. Anschließend wir die loop()-Funktion in einer **Endlosschleife** ausgeführt. Füge in die Setup()-Funktion Blöcke ein, um z.B. das Display zu initalisieren, eine Verbindung zum WiFi-Netzwerk herzustellen oder um die LoRa Verbindung zu initialsieren.";
Blockly.Msg.ARD_HIGH = "HIGH";
Blockly.Msg.ARD_HIGHLOW_TIP =
  "Setzt einen Status auf HIGH oder LOWSet a pin state logic High or Low.";
Blockly.Msg.ARD_LOW = "LOW";
Blockly.Msg.ARD_MAP = "Verteile Wert";
Blockly.Msg.ARD_MAP_FROMMIN = "von Minimum";
Blockly.Msg.ARD_MAP_FROMMAX = "bis maximum";
Blockly.Msg.ARD_MAP_TOMIN = "auf Minimum";
Blockly.Msg.ARD_MAP_TOMAX = "bis Maximum";
Blockly.Msg.ARD_MAP_TIP = "Verteilt Werte zwischen [0-1024] zu andere.";
Blockly.Msg.ARD_MAP_VAL = "Wert zu [0-";
Blockly.Msg.ARD_NOTONE = "Schalte Ton aus an Pin";
Blockly.Msg.ARD_NOTONE_PIN = "keinen Ton an Pin";
Blockly.Msg.ARD_NOTONE_PIN_TIP = "Stoppe die Tonerzeugung an Pin";
Blockly.Msg.ARD_NOTONE_TIP = "Schaltet den Ton am ausgewählten Pin aus";
Blockly.Msg.ARD_PIN_WARN1 =
  "Pin %1 wird benötigt für  %2 als Pin %3. Bereitsgenutzt als %4.";
Blockly.Msg.ARD_PULSETIMEOUT_TIP =
  "Misst die Laufzeit eines Impulses am ausgewählten Pin, wenn die Zeit ist in Microsekunden.";
Blockly.Msg.ARD_PULSE_READ = "Misst %1 Impuls an Pin #%2";
Blockly.Msg.ARD_PULSE_READ_TIMEOUT =
  "Misst %1 Impuls an Pin #%2 (Unterbrechung nach %3 μs)";
Blockly.Msg.ARD_PULSE_TIP =
  "Misst die Zeit eines Impulses an dem ausgewählten Pin.";
Blockly.Msg.ARD_SERIAL_BPS = "bps";
Blockly.Msg.ARD_SERIAL_PRINT = "schreibe";
Blockly.Msg.ARD_SERIAL_PRINT_NEWLINE = "neue Zeile hinzufügen";
Blockly.Msg.ARD_SERIAL_PRINT_TIP =
  "Prints data to the console/serial port as human-readable ASCII text."; // untranslated
Blockly.Msg.ARD_SERIAL_PRINT_WARN =
  "A setup block for %1 must be added to the workspace to use this block!"; // untranslated
Blockly.Msg.ARD_SERIAL_SETUP = "Setup";
Blockly.Msg.ARD_SERIAL_SETUP_TIP =
  "Selects the speed for a specific Serial peripheral"; // untranslated
Blockly.Msg.ARD_SERIAL_SPEED = ":  Übertragungsgeschwindigkeit zu";
Blockly.Msg.ARD_SERVO_READ = "liest SERVO an PIN#";
Blockly.Msg.ARD_SERVO_READ_TIP = "Liest den Winkel des Servomotors aus";
Blockly.Msg.ARD_SERVO_WRITE = "setzt SERVO an Pin";
Blockly.Msg.ARD_SERVO_WRITE_DEG_180 = "Winkel (0~180)";
Blockly.Msg.ARD_SERVO_WRITE_TIP = "Set a Servo to an specified angle"; // untranslated
Blockly.Msg.ARD_SERVO_WRITE_TO = ""; // untranslated
Blockly.Msg.ARD_SETTONE = "Spiele Ton an Pin"; // untranslated
Blockly.Msg.ARD_SPI_SETUP = "Setup";
Blockly.Msg.ARD_SPI_SETUP_CONF = "Konfiguration:";
Blockly.Msg.ARD_SPI_SETUP_DIVIDE = "clock divide"; // untranslated
Blockly.Msg.ARD_SPI_SETUP_LSBFIRST = "LSBFIRST"; // untranslated
Blockly.Msg.ARD_SPI_SETUP_MODE = "SPI mode (idle - edge)"; // untranslated
Blockly.Msg.ARD_SPI_SETUP_MODE0 = "0 (LOW - Fallend)";
Blockly.Msg.ARD_SPI_SETUP_MODE1 = "1 (LOW - Steigend)";
Blockly.Msg.ARD_SPI_SETUP_MODE2 = "2 (HIGH - Fallend)";
Blockly.Msg.ARD_SPI_SETUP_MODE3 = "3 (HIGH - Steigend)";
Blockly.Msg.ARD_SPI_SETUP_MSBFIRST = "MSBFIRST"; // untranslated
Blockly.Msg.ARD_SPI_SETUP_SHIFT = "data shift"; // untranslated
Blockly.Msg.ARD_SPI_SETUP_TIP = "Configures the SPI peripheral."; // untranslated
Blockly.Msg.ARD_SPI_TRANSRETURN_TIP =
  "Send a SPI message to an specified slave device and get data back."; // untranslated
Blockly.Msg.ARD_SPI_TRANS_NONE = "none"; // untranslated
Blockly.Msg.ARD_SPI_TRANS_SLAVE = "to slave pin"; // untranslated
Blockly.Msg.ARD_SPI_TRANS_TIP =
  "Send a SPI message to an specified slave device."; // untranslated
Blockly.Msg.ARD_SPI_TRANS_VAL = "transfer"; // untranslated
Blockly.Msg.ARD_SPI_TRANS_WARN1 =
  "A setup block for %1 must be added to the workspace to use this block!"; // untranslated
Blockly.Msg.ARD_SPI_TRANS_WARN2 = "Old pin value %1 is no longer available."; // untranslated
Blockly.Msg.ARD_STEPPER_COMPONENT = "stepper"; // untranslated
Blockly.Msg.ARD_STEPPER_DEFAULT_NAME = "MyStepper"; // untranslated
Blockly.Msg.ARD_STEPPER_FOUR_PINS = "4"; // untranslated
Blockly.Msg.ARD_STEPPER_MOTOR = "stepper motor:"; // untranslated
Blockly.Msg.ARD_STEPPER_NUMBER_OF_PINS = "Number of pins"; // untranslated
Blockly.Msg.ARD_STEPPER_PIN1 = "pin1#"; // untranslated
Blockly.Msg.ARD_STEPPER_PIN2 = "pin2#"; // untranslated
Blockly.Msg.ARD_STEPPER_PIN3 = "pin3#"; // untranslated
Blockly.Msg.ARD_STEPPER_PIN4 = "pin4#"; // untranslated
Blockly.Msg.ARD_STEPPER_REVOLVS = "how many steps per revolution"; // untranslated
Blockly.Msg.ARD_STEPPER_SETUP = "Setup stepper motor"; // untranslated
Blockly.Msg.ARD_STEPPER_SETUP_TIP =
  "Configures a stepper motor pinout and other settings."; // untranslated
Blockly.Msg.ARD_STEPPER_SPEED = "set speed (rpm) to"; // untranslated
Blockly.Msg.ARD_STEPPER_STEP = "move stepper"; // untranslated
Blockly.Msg.ARD_STEPPER_STEPS = "steps"; // untranslated
Blockly.Msg.ARD_STEPPER_STEP_TIP =
  "Turns the stepper motor a specific number of steps."; // untranslated
Blockly.Msg.ARD_STEPPER_TWO_PINS = "2"; // untranslated
Blockly.Msg.ARD_TIME_DELAY = "Warte";
Blockly.Msg.ARD_TIME_DELAY_MICROS = "Mikrosekunden";
Blockly.Msg.ARD_TIME_DELAY_MICRO_TIP =
  "Warte eine spezifischen Zeit in Microsekunden";
Blockly.Msg.ARD_TIME_DELAY_TIP = "Warte spezifische Zeit in Millisekunden";
Blockly.Msg.ARD_TIME_INF = "Warte für immer (Beende Programm)";
Blockly.Msg.ARD_TIME_INF_TIP = "Stoppt das Programm.";
Blockly.Msg.ARD_TIME_MICROS = "Bereits vergangen Zeit (Mikrosekunden)";
Blockly.Msg.ARD_TIME_MICROS_TIP =
  "Gibt eine Zahl in Microsekunden zurück, die der Zeitdauer des Aktuellen Programms entspricht. Muss als positiven Integer gespeichert werden"; // untranslated
Blockly.Msg.ARD_TIME_MILLIS = "Bereits vergangen Zeit (Millisekunden)";
Blockly.Msg.ARD_TIME_MILLIS_TIP =
  "Gibt eine Zahl in Millisekunden zurück, die der Zeitdauer des Aktuellen Programms entspricht. Muss als positiven Integer gespeichert werden"; // untranslated
Blockly.Msg.ARD_TIME_MS = "Millisekunden";
Blockly.Msg.ARD_TONEFREQ = "mit Frequenz";
Blockly.Msg.ARD_TONE_FREQ = "Frequenz";
Blockly.Msg.ARD_TONE_PIN = "Ton PIN#";
Blockly.Msg.ARD_TONE_PIN_TIP = "Erzeugt einen Ton an Pin";
Blockly.Msg.ARD_TONE_TIP =
  "Erzeugt einen Ton an Pin mit einer spezifischen Frequenz zwischen 31 - 65535";
Blockly.Msg.ARD_TONE_WARNING = "Frequenz muss zwischen 31 - 65535 liegen";
Blockly.Msg.ARD_TYPE_ARRAY = "Array";
Blockly.Msg.ARD_TYPE_BOOL = "Boolean";
Blockly.Msg.ARD_TYPE_CHAR = "Zeichen";
Blockly.Msg.ARD_TYPE_CHILDBLOCKMISSING = "ChildBlockMissing"; // untranslated
Blockly.Msg.ARD_TYPE_DECIMAL = "Dezimalzahl";
Blockly.Msg.ARD_TYPE_LONG = "große Zahl";
Blockly.Msg.ARD_TYPE_NULL = "Null";
Blockly.Msg.ARD_TYPE_NUMBER = "Zahl";
Blockly.Msg.ARD_TYPE_SHORT = "kurze Zahl";
Blockly.Msg.ARD_TYPE_TEXT = "Text";
Blockly.Msg.ARD_TYPE_UNDEF = "Undefiniert";
Blockly.Msg.ARD_VAR_AS = "als";
Blockly.Msg.ARD_VAR_AS_TIP = "Wert einem spezififischen Datentyp zuordnen";
Blockly.Msg.ARD_WRITE_TO = "zu";
Blockly.Msg.NEW_INSTANCE = "Neue Instanz...";
Blockly.Msg.NEW_INSTANCE_TITLE = "Neue Instanz mit Name:";
Blockly.Msg.RENAME_INSTANCE = "Instanz umbenennen...";
Blockly.Msg.RENAME_INSTANCE_TITLE = "Benenne alle '%1' Instanzen zu:";

/*senseBox Blockly Translations*/

Blockly.Msg.senseBox_basic_blue = "Blau";
Blockly.Msg.senseBox_basic_green = "Grün";
Blockly.Msg.senseBox_basic_red = "Rot";
Blockly.Msg.senseBox_basic_state = "Status";
Blockly.Msg.senseBox_off = "Aus";
Blockly.Msg.senseBox_on = "Ein";
Blockly.Msg.senseBox_sensor = "Sensoren";
Blockly.Msg.senseBox_output_filename = "Daten";
Blockly.Msg.senseBox_output_format = "Format:";

/**
 * SD-Block
 */
Blockly.Msg.senseBox_sd_create_file = "Erstelle Datei auf SD-Karte";
Blockly.Msg.senseBox_sd_write_file = "Schreibe Daten auf SD-Karte";
Blockly.Msg.senseBox_sd_open_file = "Öffne eine Datei auf der SD-Karte";
Blockly.Msg.senseBox_sd_create_file_tooltip =
  "Erstellt eine Datei auf der Karte. Stecke das SD-Bee auf den Steckplatz **XBEE2**. Die **maximale** Länge des Dateinamen sind **8 Zeichen**. Die Datei sollte zuerst im *Setup()* erstellt werden";
Blockly.Msg.senseBox_sd_write_file_tooptip =
  "Schreibe Daten auf die SD-Karte. Beachte, dass die Datei zuerst geöffnet werden muss.";
Blockly.Msg.senseBox_sd_open_file_tooltip =
  "Öffne die Datei auf der SD-Karte, um Dateien zu speichern. Am Ende der Schleife wird die Datei automatisch wieder geschlossen.";
Blockly.Msg.sensebox_sd_filename = "Daten";
Blockly.Msg.senseBox_SD_COMPONENT = "SD-Block";
Blockly.Msg.senseBox_sd_decimals = "Dezimalen";

Blockly.Msg.senseBox_output_linebreak = "Zeilenumbruch";
Blockly.Msg.senseBox_output_networkid = "NetzwerkID";
Blockly.Msg.senseBox_output_password = "Passwort";
Blockly.Msg.senseBox_output_safetosd = "Auf SD Karte speichern";
Blockly.Msg.senseBox_output_safetosd_tip = "Speichert Messwerte auf SD Karte";
Blockly.Msg.senseBox_output_serialprint = "Auf Kommandozeile ausgeben";
Blockly.Msg.senseBox_serial_tip =
  "Gibt Messwerte oder Daten auf dem Seriellen Monitor der Arduino IDE aus. Praktisch um ohne Display zu arbeiten";
Blockly.Msg.senseBox_output_timestamp = "Zeitstempel (RFC 3339)";

Blockly.Msg.senseBox_led = "LED an digitalen";
Blockly.Msg.senseBox_led_tip =
  "Einfache LED. Beim Anschluss sollte immer ein Vorwiderstand verwendet werden";
Blockly.Msg.senseBox_piezo = "Piezo an digital";
Blockly.Msg.senseBox_piezo_tip =
  "Piezo an digital PIN. Beim Anschluss sollte immer ein Vorwiderstand verwendet werden";
Blockly.Msg.senseBox_foto = "Fotowiderstand";
Blockly.Msg.senseBox_foto_tip = "Fotowiderstand";
Blockly.Msg.senseBox_hum = "Luftfeuchtigkeit in %";
Blockly.Msg.senseBox_hum_tip = "Luftfeuchtigkeit";
Blockly.Msg.senseBox_ir = "Infrarot Abstandssensor";
Blockly.Msg.senseBox_ir_tip = "Infrarot Abstandssensor";
Blockly.Msg.senseBox_lux = "Helligkeitssensor";
Blockly.Msg.senseBox_lux_tip = "Helligkeitssensor";
Blockly.Msg.senseBox_poti = "Potenziometer";
Blockly.Msg.senseBox_poti_tip = "Potenziometer";
Blockly.Msg.senseBox_pressure_sensor = "Luftdruck-/Temperatursensor (BMP280)";
Blockly.Msg.senseBox_pressure = "Luftdruck in hPa";
Blockly.Msg.senseBox_pressure_dimension = "Luftdruck in hPa";
Blockly.Msg.senseBox_pressure_tip = "Luftdrucksensor";
Blockly.Msg.senseBox_pressure_referencePressure = "Luftdruck auf NN";
Blockly.Msg.senseBox_pressure_referencePressure_dim = "hPa";
Blockly.Msg.senseBox_sound = "Mikrofon";
Blockly.Msg.senseBox_sound_tip =
  "Gibt den Messwert des Mikrofons in Volt zurück";

/**
 * RGB-LED
 */
Blockly.Msg.senseBox_rgb_led = "RGB-LED";
Blockly.Msg.senseBox_rgb_led_tip =
  "RGB-LED benötigt einen digitalen Pin und eine Stromkreis ";

/**
 * Temperature and Humidity Sensor (HDC1080)
 */
Blockly.Msg.senseBox_temp = "Temperatur in °C";
Blockly.Msg.sensebox_hdc1080 = "Temperatur-/Luftfeuchtigkeitssensor (HDC1080)";
Blockly.Msg.sensebox_hdc1080_tooltip =
  "Dieser Block gibt dir die Messwerte des Temperatur- und Luftfeuchtigkeitssensor zurück. Schließe den Sensor an einen der 5 I2C Anschlüsse an. Messwert wird mit 2 Nachkommastellen ausgegeben.";

/**
 * Ultraschalldistanzsensor
 */

Blockly.Msg.senseBox_ultrasonic = "Ultraschall-Abstandssensor an Port";
Blockly.Msg.senseBox_ultrasonic_trigger = "Trigger";
Blockly.Msg.senseBox_ultrasonic_echo = "Echo";
Blockly.Msg.senseBox_ultrasonic_port_A = "A";
Blockly.Msg.senseBox_ultrasonic_port_B = "B";
Blockly.Msg.senseBox_ultrasonic_port_C = "C";
Blockly.Msg.senseBox_ultrasonic_tooltip = `Misst die Distanz mithilfe von Ultraschall in cm. Schließe den Sensor an einen der drei Digital/Analog Ports an:
- Trigger: Grünes Kabel
- Echo: gelbes Kabel`;

/**
 * UV and Lightsensor
 */
Blockly.Msg.senseBox_value = "Messwert:";
Blockly.Msg.senseBox_uv_light = "Helligkeit-/UV-Sensor";
Blockly.Msg.senseBox_uv_light_tooltip =
  "Sensor misst UV-Licht oder die Helligkeit. Die Helligkeit wird als **Ganzezahl** in Lux ausgegeben. Die UV-Intensität als **Kommazahl** in µW/cm².";
Blockly.Msg.senseBox_uv = "UV-Intensität in µW/cm²";
Blockly.Msg.senseBox_light = "Beleuchtungsstärke in Lux";

/**
 * BMX055
 */

Blockly.Msg.senseBox_bmx055_compass = "Lage Sensor";
Blockly.Msg.senseBox_bmx055_accelerometer = "Beschleunigungssensor";
Blockly.Msg.senseBox_bmx055_accelerometer_range = "Messbereich";
Blockly.Msg.senseBox_bmx055_accelerometer_range_2g = "2g";
Blockly.Msg.senseBox_bmx055_accelerometer_range_4g = "4g";
Blockly.Msg.senseBox_bmx055_accelerometer_range_8g = "8g";
Blockly.Msg.senseBox_bmx055_accelerometer_range_16g = "16g";
Blockly.Msg.senseBox_bmx055_accelerometer_direction = "Richtung";
Blockly.Msg.senseBox_bmx055_accelerometer_direction_x = "X-Achse";
Blockly.Msg.senseBox_bmx055_accelerometer_direction_y = "Y-Achse";
Blockly.Msg.senseBox_bmx055_accelerometer_direction_z = "Z-Achse";
Blockly.Msg.senseBox_bmx055_accelerometer_direction_total = "Gesamt";
Blockly.Msg.senseBox_bmx055_gyroscope = "Lage Sensor";
Blockly.Msg.senseBox_bmx055_accelerometer_tip = "Lage Sensor";
Blockly.Msg.senseBox_bmx055_compass_tip = "Lage Sensor";
Blockly.Msg.senseBox_bmx055_gyroscope_tip = "Lage Sensor";
Blockly.Msg.senseBox_bmx055_x = "X-Richtung";
Blockly.Msg.senseBox_bmx055_y = "Y-Richtung";
Blockly.Msg.senseBox_bmx055_accelerometer_tooltip = `Dieser Block gibt dir den Messwert des Beschleunigungssensors der direkt auf der senseBox MCU aufgelötet ist. Im Dropdown Menü kannst du die Richtung und den Messbereich auswählen.`;

/**
 * WiFi
 */
Blockly.Msg.senseBox_wifi_connect = "Verbinde mit WLAN";
Blockly.Msg.senseBox_wifi_ssid = "Netzwerkname";
Blockly.Msg.senseBox_wifi_tooltip =
  "Stellt eine Verbindung mit einem WLAN-Netzwerk her. Möchtest du dich mit einem ungesicheren Netzwerk (z.B. Freifunk) verbinden lösche das Feld Passwort. Das WiFi-Bee muss auf den Steckplatz **XBEE1** aufgesteckt werden.";
Blockly.Msg.senseBox_wifi_startap = "Initialisiere WLAN Access Point";
Blockly.Msg.senseBox_wifi_startap_tooltip =
  "Erstellt einen WiFi-Accesspoint zu dem du dich verbinden kannst. Beachte, dass immer nur 1 Gerät gleichzeitig verbunden werden kann.";
Blockly.Msg.senseBox_wifi_helpurl =
  "https://docs.sensebox.de/blockly/blockly-web-wifi/";
/**
 * openSenseMap
 */
Blockly.Msg.senseBox_osem_connection_tip = "stellt eine WLAN verbindung her";
Blockly.Msg.senseBox_send_to_osem_tip = "sende Messwert an";
Blockly.Msg.senseBox_send_to_osem = "Sende Messwert an die openSenseMap";
Blockly.Msg.senseBox_osem_connection = "Verbinde mit openSenseMap:";
Blockly.Msg.senseBox_osem_host = "opensensemap.org";
Blockly.Msg.senseBox_osem_host_workshop = "workshop.opensensemap.org";
Blockly.Msg.senseBox_osem_connection = "Verbinde mit openSenseMap";
Blockly.Msg.senseBox_osem_exposure = "Typ";
Blockly.Msg.senseBox_osem_stationary = "Stationär";
Blockly.Msg.senseBox_osem_mobile = "Mobil";
Blockly.Msg.senseBox_osem_access_token = "API Schlüssel";

/**
 * Feinstaubsensor (SDS011)
 */

Blockly.Msg.senseBox_sds011 = "Feinstaubsensor";
Blockly.Msg.senseBox_sds011_dimension = "in µg/m³ an";
Blockly.Msg.senseBox_sds011_pm25 = "PM2.5";
Blockly.Msg.senseBox_sds011_pm10 = "PM10";
Blockly.Msg.senseBox_sds011_tooltip =
  "Dieser Block gibt dir den Messwert des Feinstaubsensor. Schließe den Feinstaubsensor an einen der 2 **Serial/UART** Anschlüssen an. Im Dropdown Menü zwischen PM2.5 und PM10 auswählen. Der Messwert wird dir als **Kommazahl** in µg/m3";
Blockly.Msg.senseBox_sds011_serial1 = "Serial1";
Blockly.Msg.senseBox_sds011_serial2 = "Serial2";

/**
 * Display
 */

Blockly.Msg.senseBox_display_beginDisplay = "Display initialisieren";
Blockly.Msg.senseBox_display_beginDisplay_tooltip = `Initialisiert das Display. Dieser Block muss im Setup() verwendet werden. 
**Anschluss:** I2C
`;
Blockly.Msg.senseBox_display_clearDisplay_tooltip =
  "Löscht die Anzeige auf dem Display. Sollte immer zu Begin oder am Ende der Endlosschleife aufgerufen werden.";
Blockly.Msg.senseBox_display_clearDisplay = "Display löschen";
Blockly.Msg.senseBox_display_printDisplay = "Schreibe Text/Zahl";
Blockly.Msg.senseBox_display_printDisplay_tooltip =
  "Zeigt eine Zahl/Text auf dem Display an. Über die X- und Y-Koordinaten kann die Position auf dem Display bestimmt werden. Die Schriftgröße lässt sich in ganzzahligen Werten zwischen 1 und 4 einstellen. Das Display hat eine Auflösung von 128x64 Pixeln (X- und Y-Achse)";
Blockly.Msg.senseBox_display_printDisplay_x = "x-Koordinate";
Blockly.Msg.senseBox_display_printDisplay_y = "y-Koordinate";
Blockly.Msg.senseBox_display_printDisplay_value = "Wert";
Blockly.Msg.senseBox_display_setSize = "Schriftgröße";
Blockly.Msg.senseBox_display_setSize_tip =
  "Ändere die Schriftgröße auf einen Wert zwischen 1 und 10.";
Blockly.Msg.senseBox_display_color = "Schriftfarbe";
Blockly.Msg.senseBox_display_white = "Weiß";
Blockly.Msg.senseBox_display_black = "Schwarz";
Blockly.Msg.sensebox_display_show = "Zeige auf dem Display";
Blockly.Msg.sensebox_display_show_tip =
  "Zeigt den Nachfolgenden Inhalt auf dem Bildschirm";
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
Blockly.Msg.senseBox_display_printDisplay_tooltip =
  "Mit diesem Block können automatisch Diagramme auf dem Display erstellt werden.";
Blockly.Msg.senseBox_display_plotTimeFrame = "Zeitabschnitt";
Blockly.Msg.sensebox_display_fillCircle = "Zeichne Punkt";
Blockly.Msg.sensebox_display_fillCircle_radius = "Radius";
Blockly.Msg.senseBox_display_fillCircle_tooltip =
  "Mit diesem Block kann ein Punkt auf dem Display angezeigt werden. Über die Koordinaten kannst du den Punkt auf dem Display platzieren und mithilfe des Radius die Größe bestimmen.";
Blockly.Msg.sensebox_display_drawRectangle = "Zeichne Rechteck";
Blockly.Msg.sensebox_display_drawRectangle_width = "Breite";
Blockly.Msg.sensebox_display_drawRectangle_height = "Höhe";
Blockly.Msg.senseBox_display_drawRectangle_tooltip =
  "Dieser Block zeichnet ein Rechteck auf das Display. Mit den X- und Y-Koordinaten wird die Position der oberen linken Ecke des Rechtecks auf dem Display bestimmt. Die Höhe und Breite wird in Pixeln angegeben und mit der Checkbox 'Ausgefüllt' kann ausgewählt werden ob das Rechteck ausgefüllt oder nur als Rahmen angezeigt wird.";
Blockly.Msg.senseBox_display_filled = "Ausgefüllt";
Blockly.Msg.senseBox_display_fastPrint_show = "Zeige Messwerte";
Blockly.Msg.senseBox_display_fastPrint_title = "Titel";
Blockly.Msg.senseBox_display_fastPrint_value = "Messwert";
Blockly.Msg.senseBox_display_fastPrint_dimension = "Einheit";
Blockly.Msg.sensebox_display_fastPrint_tooltip =
  "Zeigt zwei Messwerte auf dem Display an. Wähle eine Überschrift für jeden Messwert und gib die Einheit an.";
Blockly.Msg.senseBox_display_helpurl =
  "https://docs.sensebox.de/blockly/blockly-display/";

// GPS
Blockly.Msg.senseBox_gps_getValues = "GPS Modul";
Blockly.Msg.senseBox_gps_lat = "Breitengrad";
Blockly.Msg.senseBox_gps_lng = "Längengrad";
Blockly.Msg.senseBox_gps_alt = "Höhe über NN in m";
Blockly.Msg.senseBox_gps_speed = "Geschwindigkeit in km/h";
Blockly.Msg.senseBox_gps_date = "Datum";
Blockly.Msg.senseBox_gps_time = "Uhrzeit";
Blockly.Msg.senseBox_gps_timeStamp = "Zeitstempel (RFC 3339)";
Blockly.Msg.senseBox_gps_tooltip = `Liest das GPS Modul aus und gibt dir die Standortinformationen. Längen- und Breitengrad werden als Kommazahl mit 6 Nachkommastellen ausgegeben. 
**Anschluss: I2C**
`;

Blockly.Msg.senseBox_send_mobile_to_osem =
  "Sende Messwert und Standort an die openSenseMap";
Blockly.Msg.senseBox_send_mobile_to_osem_tip =
  "Sende Messwert und Standort an die openSenseMap";

/**
 * Interval Block
 */
Blockly.Msg.senseBox_interval_timer = "Messintervall";
Blockly.Msg.senseBox_interval = "ms";
Blockly.Msg.senseBox_interval_timer_tip = "Intervall";
Blockly.Msg.senseBox_soil = "Bodenfeuchte";
Blockly.Msg.senseBox_watertemperature = "Wassertemperatur";

/**
 * Cases
 */
Blockly.Msg.cases_do = "Führe aus";
Blockly.Msg.cases_condition = "Fall (Variable) = ";
Blockly.Msg.cases_switch = "Variable";
Blockly.Msg.cases_add = "Fall";

/**
 * Button
 */
Blockly.Msg.senseBox_button = "Button";
Blockly.Msg.senseBox_button_isPressed = "ist gedrückt";
Blockly.Msg.senseBox_button_switch = "als Schalter";
Blockly.Msg.senseBox_button_wasPressed = "wurde gedrückt";
Blockly.Msg.senseBox_button_tooltip = `Dieser Block gibt dir den Status des angeschlossenen Buttons. Im Dropdown Menü können verschiedene Modi für den Button ausgewählt werden. Angesteuert können entweder der on Board Button oder ein Button, der an einen der 6 digitalen Pins angeschlossen ist. verschiedene Modi:
- "ist gedrückt": Mit diesem Modus kannst du abfragen ob der Block gerade gedrückt wird. Du erhältst entweder den Wert TRUE oder FALSE.
- "wurde gedrückt": Mit diesem Modus kannst du abfragen ob der Block gedrückt wurde. Erst wenn der Knopf gedrückt und wieder losgelassen wurde erhältst du TRUE zurück
- "als Schalter": Wenn du diesen Block verwendest kannst du den Knopf wie ein Lichtschalter verwenden. Der Status wird gespeichert bis der Button erneut gedrückt wird`;

/**
 * Webserver
 */

Blockly.Msg.senseBox_ip_address = "IP-Adresse";
Blockly.Msg.senseBox_ip_address_tip =
  "Gibt die IP-Adresse als Zeichenkette zurück.";
Blockly.Msg.senseBox_init_http_server_tip =
  "Initialisiert einen http-Server auf dem angegebenen Port";
Blockly.Msg.senseBox_init_http_server = "HTTP-Server initialisieren";
Blockly.Msg.senseBox_http_on_client_connect = "Wenn Client verbunden ist:";
Blockly.Msg.senseBox_http_on_client_connect_tip =
  "Überprüft, ob ein Client verbunden ist und führt in diesem Fall die angegebene Anweisung aus";
Blockly.Msg.senseBox_http_method = "Methode";
Blockly.Msg.senseBox_http_method_tip = "Methode des aktuellen HTTP-Requests";
Blockly.Msg.senseBox_http_uri = "URI";
Blockly.Msg.senseBox_http_uri_tip =
  "URI der angeforderten Ressource der aktuellen HTTP-Anfrage";
Blockly.Msg.senseBox_http_user_agent = "User-Agent";
Blockly.Msg.senseBox_http_user_agent_tip =
  "Der Benutzer-Agent sendet zusammen mit der aktuellen HTTP-Anfrage";
Blockly.Msg.senseBox_http_protocol_version = "HTTP Version";
Blockly.Msg.senseBox_http_protocol_version_tip =
  "The HTTP Version of the current HTTP request";
Blockly.Msg.senseBox_http_success_tip =
  "Senden einer erfolgreichen HTTP-Antwort mit Inhalt";
Blockly.Msg.senseBox_http_not_found_tip =
  "Senden einer vordefinierten 404 HTTP-Antwort.";
Blockly.Msg.senseBox_http_success = "Erfolgreiche";
Blockly.Msg.senseBox_http_success_l2 = "HTTP-Antwort";
Blockly.Msg.senseBox_http_success_buildhtml = "HTML:";
Blockly.Msg.senseBox_http_not_found = "404 Fehler";
Blockly.Msg.senseBox_html_document = "HTML";
Blockly.Msg.senseBox_html_header = "<head>";
Blockly.Msg.senseBox_html_header_end = "</head>";
Blockly.Msg.senseBox_html_body = "<body>";
Blockly.Msg.senseBox_html_body_end = "</body>";
Blockly.Msg.senseBox_html_general_tag_tip =
  "Ein allgemeiner HTML-Tag-Baustein.";
Blockly.Msg.senseBox_html_document_tip =
  "Ein Block zum Erzeugen eines HTML-Dokuments...";
Blockly.Msg.senseBox_tag_first_mutator_tip =
  "Mögliche Erweiterungen zu diesem Block...";
Blockly.Msg.senseBox_tag_optional_mutator_tip =
  "Mehr Tags zum Block hinzufügen";
Blockly.Msg.senseBox_sd_web_readHTML = "Lese HTML von SD Karte";
Blockly.Msg.sensebox_web_readHTML_filename = "Datei:";
Blockly.Msg.senseBox_bme680 = "Umweltsensor (BME680)";
Blockly.Msg.senseBox_bme680_tip = "Gibt Messwerte des BME680 zurück";
Blockly.Msg.senseBox_bme680_warning =
  "Achtung. Gas (VOC) kann nicht gleichzeitig mit anderen Parametern gemessen werden";
Blockly.Msg.senseBox_gas = "Gas (VOC)";
Blockly.Msg.sensebox_soil_smt50 = "Bodenfeuchte/-temperatur (SMT50)";

/**
 * LoRa Blöcke
 */

Blockly.Msg.senseBox_LoRa_connect = "Zu TTN senden";
Blockly.Msg.senseBox_LoRa_device_id = "Device EUI (lsb)";
Blockly.Msg.senseBox_LoRa_app_id = "Application EUI (lsb)";
Blockly.Msg.senseBox_LoRa_app_key = "App Key (msb)";
Blockly.Msg.senseBox_LoRa_nwskey_id = "Network Session Key (msb)";
Blockly.Msg.senseBox_LoRa_appskey_id = "App Session Key (msb)";
Blockly.Msg.senseBox_LoRa_devaddr_id = "Device Adress";
Blockly.Msg.senseBox_LoRa_interval = "Intervall in Minuten";
Blockly.Msg.senseBox_measurement = "Messung";
Blockly.Msg.senseBox_measurements = "Messungen";

Blockly.Msg.senseBox_LoRa_send_message = "Sende als Lora Nachricht";
Blockly.Msg.senseBox_LoRa_send_cayenne = "Sende als Cayenne Nachricht";
Blockly.Msg.senseBox_LoRa_cayenne_temperature = "Temperatur";
Blockly.Msg.senseBox_LoRa_cayenne_channel = "Kanal";
Blockly.Msg.senseBox_LoRa_cayenne_humidity = "Luftfeuchtigkeit";
Blockly.Msg.senseBox_LoRa_cayenne_pressure = "Luftdruck";
Blockly.Msg.senseBox_LoRa_cayenne_luminosity = "Helligkeit";
Blockly.Msg.senseBox_LoRa_cayenne_analog = "Analoger Wert";
Blockly.Msg.senseBox_LoRa_cayenne_x = "X Wert";
Blockly.Msg.senseBox_LoRa_cayenne_y = "Y Wert";
Blockly.Msg.senseBox_LoRa_cayenne_z = "Z Wert";
Blockly.Msg.senseBox_LoRa_cayenne_lat = "Breitengrad";
Blockly.Msg.senseBox_LoRa_cayenne_lng = "Längengrad";
Blockly.Msg.senseBox_LoRa_cayenne_alt = "Höhe";

Blockly.Msg.senseBox_LoRa_cayenne_tip =
  "Sende Daten als Cayenne Payload Format";
Blockly.Msg.senseBox_LoRa_cayenne_gps_tip = "Sende GPS";
Blockly.Msg.senseBox_LoRa_cayenne_temperature_tip =
  "Sendet Temperaturwert mit einer Nachkommastelle";
Blockly.Msg.senseBox_LoRa_cayenne_pressure_tip =
  "Sendet Luftdruck mit einer Nachkommastelle";
Blockly.Msg.senseBox_LoRa_cayenne_luminosity_tip = "Sendet Helligkeitswert";
Blockly.Msg.senseBox_LoRa_cayenne_analog_tip =
  "Sendet einen Dezimalwert mit einer Nachkommastelle";

Blockly.Msg.senseBox_LoRa_message_tip = "Sende eine Nachricht über LoRa";
Blockly.Msg.senseBox_LoRa_sensor_tip =
  "Sende eine Sensorwert mit einer bestimmten Anzahl an Bytes";
Blockly.Msg.senseBox_LoRa_init_abp_tip =
  "Initialisiere die LoRa übertragung. Kopiere die IDs im lsb Format [test](https://test.html)";

Blockly.Msg.senseBox_LoRa_init_otaa_tip =
  "Initialisiere die LoRa übertragung. Kopiere die ID's im lsb Format";

/**
 * Windspeed
 */
Blockly.Msg.senseBox_windspeed = "Windgeschwindigkeitssensor";
Blockly.Msg.senseBox_windspeed_tooltip = "";

/*
 * Soundsensor
 */
Blockly.Msg.sensebox_sen0232 = "Soundsensor (DF Robot)";
Blockly.Msg.sensebox_sen0232_tooltip = "";

/*
 * BME680
 */
Blockly.Msg.senseBox_bme680 = "Umweltsensor (BME680)";
Blockly.Msg.senseBox_bme_iaq = "Innenraumluftqualität (IAQ)";
Blockly.Msg.senseBox_bme_iaq_accuracy = "Kalibrierungswert";
Blockly.Msg.senseBox_bme_co2 = "CO2 Äquivalent";
Blockly.Msg.senseBox_bme_breatheVocEquivalent = "Atemluft VOC Äquivalent";
Blockly.Msg.senseBox_bme_tooltip = "Gibt Messwerte des BME680 zurück";

/**
 * Truebner SMT50
 */
Blockly.Msg.sensebox_soil_stm50 = "Bodenfeuchte/-temperatur (SMT50)";
/*
 * Telegram
 */
Blockly.Msg.senseBox_telegram_init = "Telegram Bot initialisieren";
Blockly.Msg.senseBox_telegram_token = "Token";
Blockly.Msg.senseBox_telegram_do = "Telegram mache";
Blockly.Msg.senseBox_telegram_do_tooltip =
  "Füge in diese Schleife die Blöcke ein, die dein Telegram Bot ausführen soll. Beachte hierbei, dass du Aktionen bei einer bestimmten Nachricht ausführen lassen kannst oder auch selbst eine Nachricht versenden werden kann.";
Blockly.Msg.senseBox_telegram_do_on_message = "bei Nachricht";
Blockly.Msg.senseBox_telegram_message = "Nachricht";
Blockly.Msg.senseBox_telegram_message_tooltip =
  "Führe eine Aktion aus, wenn der Telegram eine *Nachricht* empfangen hat.";
Blockly.Msg.senseBox_telegram_send = "Sende Nachricht";
Blockly.Msg.senseBox_telegram_send_tooltip =
  "Dein Telgram Bot sendet dir eine Nachricht auf dein Handy. Die Nachricht kann zum Beispiel ein Alarm oder auch ein Messwert sein";
Blockly.Msg.senseBox_telegram_init_tooltip =
  "Initialisiere den Telegram Bot. Verwende diesen Block in der **Setup()-Schleife**. Den Token kannst du dir über den Telegram erstellen.";
Blockly.Msg.senseBox_telegram_helpurl =
  "https://sensebox.de/projects/de/2019-12-15-telegram-blockly";

/*
 * SCD30 CO2 Senso
 */
Blockly.Msg.senseBox_scd30 = "CO2 Sensor (Sensirion SCD30)";
Blockly.Msg.senseBox_scd_tip = "Gibt den Wert des CO2 Sensors";
Blockly.Msg.senseBox_scd_co2 = "CO2 in ppm";

/**
 * WS2818 RGB LED
 */
Blockly.Msg.senseBox_ws2818_rgb_led = "Setze RGB-LED an";
Blockly.Msg.senseBox_ws2818_rgb_led_init = "RGB LED (WS2818) initialisieren";
Blockly.Msg.senseBox_ws2818_rgb_led_position = "Position";
Blockly.Msg.senseBox_ws2818_rgb_led_brightness = "Helligkeit";
Blockly.Msg.senseBox_ws2818_rgb_led_tooltip =
  "Verändere mit diesem Block die Farbe deiner RGB-LED. Verbinde einen Block für die Farbe. Wenn mehrere RGB-LEDs miteinander verkettet werden kannst du über die Position bestimmen welche LED angesteuert wird. ";
Blockly.Msg.senseBox_ws2818_rgb_led_init_tooltip =
  "Schließe die RGB-LED an einen der drei **digital/analog Ports** an. Wenn mehrere RGB-LEDs miteinander verkettet werden kannst du über die Position bestimmen welche LED angesteuert wird. ";
Blockly.Msg.senseBox_ws2818_rgb_led_color = "Farbe";
Blockly.Msg.senseBox_ws2818_rgb_led_number = "Anzahl";

/***
 * MQTT
 */

Blockly.Msg.senseBox_mqtt_init = "Verbinde mit MQTT Broker";
Blockly.Msg.senseBox_mqtt_server = "Server";
Blockly.Msg.senseBox_mqtt_port = "Port";
Blockly.Msg.senseBox_mqtt_username = "Benutzername";
Blockly.Msg.senseBox_mqtt_password = "Passwort";
Blockly.Msg.sensebox_mqtt_subscribe = "Subscribe to Feed";
Blockly.Msg.senseBox_mqtt_publish = "Sende an Feed/Topic";

/**
 * Add Translation for Blocks above
 * ---------------------------------------------------------------
 * Add Translation for the UI below
 */

/**
 * Typed Variable Modal
 *
 */

Blockly.Msg.TYPED_VAR_MODAL_CONFIRM_BUTTON = "Ok";
Blockly.Msg.TYPED_VAR_MODAL_VARIABLE_NAME_LABEL = "Variablen Name: ";
Blockly.Msg.TYPED_VAR_MODAL_TYPES_LABEL = "Variable Typen";
Blockly.Msg.TYPED_VAR_MODAL_CANCEL_BUTTON = "Abbrechen";
Blockly.Msg.TYPED_VAR_MODAL_TITLE = "Erstelle Variable";
Blockly.Msg.TYPED_VAR_MODAL_INVALID_NAME =
  "Der Name ist ungültig, bitte versuche einen anderen.";

/**
 * Toolbox
 */
Blockly.Msg.toolbox_sensors = "Sensoren";
Blockly.Msg.toolbox_logic = "Logik";
Blockly.Msg.toolbox_loops = "Schleifen";
Blockly.Msg.toolbox_math = "Mathematik";
Blockly.Msg.toolbox_io = "Eingang/Ausgang";
Blockly.Msg.toolbox_time = "Zeit";
Blockly.Msg.toolbox_functions = "Funktionen";
Blockly.Msg.toolbox_variables = "Variablen";

/**
 * Tooltips
 *
 */

Blockly.Msg.tooltip_compile_code = "Code kompilieren";
Blockly.Msg.tooltip_save_blocks = "Blöcke speichern";
Blockly.Msg.tooltip_open_blocks = "Blöcke öffnen";
Blockly.Msg.tooltip_screenshot = "Screenshot erstellen";
Blockly.Msg.tooltip_clear_workspace = "Workspace zurücksetzen";
Blockly.Msg.tooltip_share_blocks = "Blöcke teilen";
Blockly.Msg.tooltip_show_code = "Code anzeigen";
Blockly.Msg.tooltip_hide_code = "Code ausblenden";
Blockly.Msg.tooltip_delete_project = "Projekt löschen";
Blockly.Msg.tooltip_project_name = "Name des Projektes";
Blockly.Msg.tooltip_download_project = "Projekt herunterladen";
Blockly.Msg.tooltip_open_project = "Projekt öffnen";
Blockly.Msg.tooltip_update_project = "Projekt aktualisieren";
Blockly.Msg.tooltip_save_project = "Projekt speichern";
Blockly.Msg.tooltip_create_project = "Projekt erstellen";
Blockly.Msg.tooltip_share_project = "Projekt teilen";
Blockly.Msg.tooltip_reset_workspace = "Workspace zurücksetzen";
Blockly.Msg.tooltip_copy_link = "Link kopieren";
Blockly.Msg.tooltip_trashcan_hide = "gelöschte Blöcke ausblenden";
Blockly.Msg.tooltip_trashcan_delete = "Blöcke endgültig löschen";
Blockly.Msg.tooltip_project_title = "Titel des Projektes";
Blockly.Msg.tooltip_check_solution = "Lösung kontrollieren";

/**
 * Messages
 *
 */

Blockly.Msg.messages_delete_project_failed =
  "Fehler beim Löschen des Projektes. Versuche es noch einmal.";
Blockly.Msg.messages_reset_workspace_success =
  "Das Projekt wurde erfolgreich zurückgesetzt";
Blockly.Msg.messages_PROJECT_UPDATE_SUCCESS =
  "Das Projekt wurde erfolgreich aktualisiert.";
Blockly.Msg.messages_GALLERY_UPDATE_SUCCESS =
  "Das Galerie-Projekt wurde erfolgreich aktualisiert.";
Blockly.Msg.messages_PROJECT_UPDATE_FAIL =
  "Fehler beim Aktualisieren des Projektes. Versuche es noch einmal.";
Blockly.Msg.messages_GALLERY_UPDATE_FAIL =
  "Fehler beim Aktualisieren des Galerie-Projektes. Versuche es noch einmal.";
Blockly.Msg.messages_gallery_save_fail_1 = "Fehler beim Speichern des ";
Blockly.Msg.messages_gallery_save_fail_2 =
  "Projektes. Versuche es noch einmal.";
Blockly.Msg.messages_SHARE_SUCCESS = "Programm teilen";
Blockly.Msg.messages_SHARE_FAIL =
  "Fehler beim Erstellen eines Links zum Teilen deines Programmes. Versuche es noch einmal.";
Blockly.Msg.messages_copylink_success =
  "Link erfolgreich in Zwischenablage gespeichert.";
Blockly.Msg.messages_rename_success_01 = "Das Projekt wurde erfolgreich in ";
Blockly.Msg.messages_rename_success_02 = "umbenannt.";
Blockly.Msg.messages_newblockly_head =
  "Willkommen zur neuen Version Blockly für die senseBox";
Blockly.Msg.messages_newblockly_text =
  "Die neue Blockly Version befindet sich zurzeit in der Testphase. Alle Neuigkeiten findet ihr hier: ";
Blockly.Msg.messages_GET_TUTORIAL_FAIL = "Zurück zur Tutorials-Übersicht";
Blockly.Msg.messages_LOGIN_FAIL =
  "Der Benutzername oder das Passwort ist nicht korrekt.";
/**
 * Share Dialog
 */

Blockly.Msg.sharedialog_headline = "Dein Link wurde erstellt.";
Blockly.Msg.sharedialog_text =
  "Über den folgenden Link kannst du dein Programm teilen.";

/**
 * Project rename Dialog
 */

Blockly.Msg.renamedialog_headline = "Projekt benennen";
Blockly.Msg.renamedialog_text =
  "Bitte gib einen Namen für das Projekt ein und bestätige diesen mit einem Klick auf 'Bestätigen'.";

/**
 * Compile Dialog
 *
 */

Blockly.Msg.compiledialog_headline = "Fehler";
Blockly.Msg.compiledialog_text =
  "Beim kompilieren ist ein Fehler aufgetreten. Überprüfe deine Blöcke und versuche es erneut";

/**
 * Buttons
 *
 */

Blockly.Msg.button_cancel = "Abbrechen";
Blockly.Msg.button_close = "Schließen";
Blockly.Msg.button_accept = "Bestätigen";
Blockly.Msg.button_compile = "Kompilieren";
Blockly.Msg.button_create_variableCreate = "Erstelle Variable";
Blockly.Msg.button_back = "Zurück";
Blockly.Msg.button_next = "nächster Schritt";
Blockly.Msg.button_tutorial_overview = "Tutorial Übersicht";
Blockly.Msg.button_login = "Anmelden";

/**
 *
 */

Blockly.Msg.filename = "Dateiname";
Blockly.Msg.projectname = "Projektname";

/**
 * Settings
 */
Blockly.Msg.settings_head = "Einstellungen";
Blockly.Msg.settings_language = "Sprache";
Blockly.Msg.settings_language_text =
  "Auswahl der Sprache gilt für die gesamte Anwendung. Es kann zwischen Deutsch und Englisch unterschieden werden.";
Blockly.Msg.settings_language_de = "Deutsch";
Blockly.Msg.settings_language_en = "Englisch";
Blockly.Msg.settings_renderer = "Renderer";
Blockly.Msg.settings_renderer_text =
  "Der eingestellte Renderer bestimmt das Aussehen der Blöcke. Es kann zwischen 'Geras' und 'Zelos' unterschieden werden, wobei 'Zelos' insbesondere für eine Touch-Anwendung geeignet ist.";
Blockly.Msg.settings_statistics = "Statistiken";
Blockly.Msg.settings_statistics_text =
  "Die Anzeige von Statistiken zur Nutzung der Blöcke oberhalb der Arbeitsfläche kann ein- oder ausgeblendet werden.";
Blockly.Msg.settings_statistics_on = "An";
Blockly.Msg.settings_statistics_off = "Aus";

/**
 * 404
 */

Blockly.Msg.notfound_head =
  "Die von Ihnen angeforderte Seite kann nicht gefunden werden.";
Blockly.Msg.notfound_text =
  "Die gesuchte Seite wurde möglicherweise entfernt, ihr Name wurde geändert oder sie ist vorübergehend nicht verfügbar.";

/**
 * Labels
 */

Blockly.Msg.labels_donotshowagain = "Dialog nicht mehr anzeigen";
Blockly.Msg.labels_here = "hier";
Blockly.Msg.labels_username = "E-Mail oder Nutzername";
Blockly.Msg.labels_password = "Passwort";

/**
 * Tutorials
 */

Blockly.Msg.tutorials_assessment_task = "Aufgabe";
Blockly.Msg.tutorials_hardware_head =
  "Für die Umsetzung benötigst du folgende Hardware:";
Blockly.Msg.tutorials_hardware_moreInformation =
  "Weitere Informationen zur Hardware-Komponente findest du";
Blockly.Msg.tutorials_hardware_here = "hier";
Blockly.Msg.tutorials_requirements =
  "Bevor du mit diesem Tutorial fortfährst solltest du folgende Tutorials erfolgreich abgeschlossen haben:";

/**
 * Tutorial Builder
 */

Blockly.Msg.builder_solution = "Lösung";
Blockly.Msg.builder_solution_submit = "Lösung einreichen";
Blockly.Msg.builder_example_submit = "Beispiel einreichen";
Blockly.Msg.builder_comment =
  "Anmerkung: Man kann den initialen Setup()- bzw. Endlosschleifen()-Block löschen. Zusätzlich ist es möglich u.a. nur einen beliebigen Block auszuwählen, ohne dass dieser als deaktiviert dargestellt wird.";
Blockly.Msg.builder_hardware_order =
  "Beachte, dass die Reihenfolge des Auswählens maßgebend ist.";
Blockly.Msg.builder_hardware_helper =
  "Wähle mindestens eine Hardware-Komponente aus.";
Blockly.Msg.builder_requirements_head = "Voraussetzungen";
Blockly.Msg.builder_requirements_order =
  "Beachte, dass die Reihenfolge des Anhakens maßgebend ist.";

/**
 * Login
 */

Blockly.Msg.login_head = "Anmelden";
Blockly.Msg.login_osem_account_01 = "Du benötigst einen ";
Blockly.Msg.login_osem_account_02 = "Account um dich einzuloggen";
Blockly.Msg.login_lostpassword = "Du hast dein Passwort vergessen?";
Blockly.Msg.login_createaccount =
  "Falls du noch keinen Account hast erstellen einen auf ";
/**
 * Navbar
 */

Blockly.Msg.navbar_tutorials = "Tutorials";
Blockly.Msg.navbar_tutorialbuilder = "Tutorial erstellen";
Blockly.Msg.navbar_gallery = "Gallerie";
Blockly.Msg.navbar_projects = "Projekte";

Blockly.Msg.navbar_menu = "Menü";
Blockly.Msg.navbar_login = "Einloggen";
Blockly.Msg.navbar_account = "Konto";
Blockly.Msg.navbar_logout = "Abmelden";
Blockly.Msg.navbar_settings = "Einstellungen";

/**
 * Codeviewer
 */

Blockly.Msg.codeviewer_arduino = "Arduino Quellcode";
Blockly.Msg.codeviewer_xml = "XML Blöcke";

/**
 * Home Tour
 */
Blockly.Msg.hometour_wrapper =
  "Willkommen zu Blockly für die senseBox. In dieser Tour werde ich dir alle wichtigen Funktionen der Oberfläche zeigen";
Blockly.Msg.hometour_workspaceFunc =
  "Hier findest du alle Buttons um dein Programm zu übertragen, zu speichern oder zu teilen";
Blockly.Msg.hometour_blocklyWindow =
  "Dies ist deine Arbeitsfläche. Hier kannst du mithilfe der Blöcke deinen Programmcode erstellen";
Blockly.Msg.hometour_blocklyToolboxDiv =
  "In der Toolbox befinden sich alle Blöcke. Verbinde diese in der Arbeitsfläche und erstelle dein Programmcode";
Blockly.Msg.hometour_compileBlocks =
  "Wenn du fertig mit dem Programmieren bist und deinen Programmcode auf die senseBox übertragen möchtest klicke hier um deinen Programmcode zu kompilieren.";
Blockly.Msg.hometour_menuButton =
  "Im Menü findest du Tutorials und eine Gallery mit verschiedenen Beispiel Programmen. Logge dich über deinen openSenseMap Account ein und du erhälst noch mehr Funktionen";
Blockly.Msg.hometour_showCode =
  "Über diesen Button kannst du dir den generierten Programmcode anzeigen lassen";
Blockly.Msg.hometour_shareBlocks =
  "Erstelle über diesen Button einen Kurzlink und teile deine Blöcke mit anderen Nutzer:innen";

/**
 * Assessment Tour
 */

Blockly.Msg.assessmenttour_solutionCheck =
  "Wenn deine Lösung fertig ist klicke hier um diese zu überprüfen";
Blockly.Msg.assessmenttour_assessmentDiv =
  "Los gehts! Löse die folgende Aufgabe, um das Tutorial abzuschließen. ";
Blockly.Msg.assessmenttour_injectionDiv =
  "Erstelle hier deine Lösung. Du kannst alle Blöcke aus der Toolbox verwenden.";

/**
 * Overlay
 */

Blockly.Msg.compile_overlay_head =
  "Dein Programm wird nun kompiliert und heruntergeladen";
Blockly.Msg.compile_overlay_text =
  "Kopiere es anschließend auf deine senseBox MCU";
Blockly.Msg.compile_overlay_help =
  "Benötigst du mehr Hilfe? Dann schaue hier: ";

/**
 * Tooltip Viewer
 */

Blockly.Msg.tooltip_viewer = "Hilfe";
Blockly.Msg.tooltip_moreInformation = "Mehr Informationen findest du ";

/**
 * FAQ
 */

Blockly.Msg.faq_q1_question = `Wie kann ich mein Programm auf die senseBox kopieren?`;
Blockly.Msg.faq_q1_answer = `Um Programme auf die senseBox zu kopieren wird diese mit dem Micro USB Kabel an den Computer angeschlossen. Mache anschließend auf der senseBox MCU einen Doppelklick auf den roten Reset Button. Die senseBox wird nun als Wechseldatenträger an deinem Computer erkannt und die zuvor erstellen Programm können per Drag & Drop kopiert werden. Nach jeder Änderung des Programmcodes muss das Programm neu kompiliert und übertragen werden
#### Lernmodus der MCU aktivieren
<iframe width="560" height="315" src="https://www.youtube.com/embed/jzlOJ7Zuqqw" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
#### Kopieren von Programmen unter MacOS
Das Kopieren der Programme unter MacOS funktioniert nicht über den Finder, es gibt es aber dennoch zwei verschiedene Möglichkeiten die Programme zu kopieren:
- [senseBox Kopiertool](https://sensebox.de/docs/senseBox_Sketch_Uploader_DE.zip)
- [muCommander](https://www.mucommander.com/)
`;

Blockly.Msg.faq_q2_question = `Mit welcher senseBox ist die Programmierumgebung kompatibel?`;
Blockly.Msg.faq_q2_answer = `
Grundsätzlich kann die Programmierumgebung mit jeder senseBox mit senseBox MCU verwendet werden. 
`;

Blockly.Msg.faq_q3_question = `Ich habe einen Fehler gefunden oder etwas funktioniert nicht. Wo kann ich diesen melden?`;
Blockly.Msg.faq_q3_answer = `
Am besten legst du dazu ein Issue auf [Github](https://github.com/sensebox/React-Ardublockly/issues) an. Alternativ kannst du uns auch eine Email an info(at)sensebox.de senden
`;

export const De = Blockly.Msg;
