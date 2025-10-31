import React, { Component } from "react";

import Breadcrumbs from "../ui/Breadcrumbs";

import { withRouter } from "react-router-dom";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import * as Blockly from "blockly";
import ReactMarkdown from "react-markdown";
import Container from "@mui/material/Container";

const news = `

# *08.01.2021* - Erstes Release der neuen Lern- und Programmierumgebung für die senseBox 

 In den letzten Wochen haben wir eine komplett neue Lern- und Programmierumgebung für die senseBox geschaffen. Die Basis bildet hierbei weiterhin Google Blockly und das Frontend wird über React realisiert. Fast alle Blöcke wurden bereits aus der alten Version in die neue Version migriert. 

![](https://radosgw.public.os.wwu.de/pad/uploads/upload_880bb55f28e0dbb0bb9c2160d8e50594.png)

## Blockly Core
Nachdem die bisherige Version, die unter [blockly.sensebox.de](https://blockly.sensebox.de) weiterhin verfügbar ist, auf einen Google Blockly Core von 2016 aufbaut, wurde es Zeit ein großes Update durchzuführen. Durch den neuen Blockly Core lassen sich auch andere Renderer der Blöcke verwenden. In den Einstellungen kannst du zwischen den zwei Renderern Geras und Zelos auswählen. Geras ist der klassische Blockly Renderer während Zelos vor allem für Touchoberfläche optimiert worden ist.

### Typed Variablen

Neue Variablen werden nun direkt mit einem bestimmten Datentyp angelegt. Ein einfacher Check überprüft ob der zurückgegeben Typ eines Blockes mit dem der Variablen kompatibel ist. 

![](https://radosgw.public.os.wwu.de/pad/uploads/upload_0d505fc2472178182995732af226e736.png)


### Funktionen (funktioniert aktuell nicht!)

Funktionen mit Rückgabe Wert und Eingabeparametern können angelegt werden. Durch die Verwendung von Funktionen lassen sich auch komplexere Programme übersichtlicher darstellen und bearbeiten. Beim Anlegen einer Funktion kann über das Zahnrad weitere Eingabeparameter hinzuefügt werden. 

![](https://radosgw.public.os.wwu.de/pad/uploads/upload_bd9544b118a1dbe83d149c00678eb39d.png)


### GPS

Der Code für das GPS Modul wurde neu aufgebaut und ermöglicht es deutlich schneller einen GPS Fix zu bekommen. Zusätzlich lassen sich bald! die Koordinaten in zwei verschiedenen Formaten zurückgebenlassen. Zum einen als Kommazahl zum anderen als Zahl ohne nachkommastellen 

### MQTT
Zwei einfache Blöcke ermöglichen es nun die Daten über MQTT an einen Broker zu versenden. Zwei Broker sind bereits "vorprogrammiert" (Adafruit IO und DIOTY). Natürlich können auch eigene Broker verwendet werden. Falls ihr gute freie Broker kennt, die wir hinzufügen sollten meldet euch einfach bei uns.

![](https://radosgw.public.os.wwu.de/pad/uploads/upload_a9df4b0b9b1e6f39f09cf3b1743caad2.png)


### TTN Mapper
Bisher war es möglich einen "kleinen" TTN Mapper zu bauen, der die Daten als Cayenne Payload versendet hat. Es gibt nun einen Block der es direkt ermöglicht einen vollständigen TTN Mapper zu Programmieren, der die Daten auch auf [TTNMapper](https://ttnmapper.org/) veröffentlichen kann.

![](https://radosgw.public.os.wwu.de/pad/uploads/upload_b59691f2ebcf04d8b67a5f4e7fbe70b6.png)


## Fronted

In der Oberfläche gibt es einige Neuigkeiten. Ziel ist es Blockly für die senseBox zu einer vollständigen Lern- und Programmierumgebung weiterzuentwickeln.  

Die Codeanzeige ist standardmäßig ausgeblendet kann aber einfach durch eine Klick auf das \`</>\` Icon hinzugefügt werden.

### Login mit openSenseMap/senseBox Account

Im Menü unter Login könnt ihr euch mit eurem openSenseMap Account anmelden. Sobald ihr angemeldet seid habt ihr die Möglichkeit Projekte online zu speichern. 
Sobald der Login mit dem openSenseMap Account erfolgreich war lassen sich die bereits registrierten senseBox unter Account einsehen. 

![](https://radosgw.public.os.wwu.de/pad/uploads/upload_c3965edc99021339a30b8d6704471e50.png)


Im Block zum senden an die openSenseMap müssen dann auch keine IDs mehr ausgewählt werden sondern die registrierten senseBox können einfach aus dem Dropdown Menü ausgewählt werden.

![](https://radosgw.public.os.wwu.de/pad/uploads/upload_57284cea57bfa5df3d55fe456f9d7cfa.png)

### Speichern von Projekten

Nach dem Login über den openSenseMap Account lassen sich Projekte online speichern und wieder abrufen

![](https://radosgw.public.os.wwu.de/pad/uploads/upload_148146b1206fde184afff6edce26b515.png)


### Tutorials

Es gibt jetzt Tutorials! Eine reihe von verschiedenen Tutorials zeigt dir die ersten Schritte in der Programmierung mit Blockly. (Inhalte werden noch ausgebaut)

![](https://radosgw.public.os.wwu.de/pad/uploads/upload_db0e64df48d4c34a9540ffb089e95769.png)

### Gallery

In der Gallery finden sich Beispiele mit verschiedenen Programmen. Die Beispiele können direkt in Blockly geöffnet werden, um Änderungen vorzunehmen oder das Programm direkt auf deine senseBox zu übertragen. 

![](https://radosgw.public.os.wwu.de/pad/uploads/upload_c61e1fa98f9d840507a8a53b00605484.png)


### Teilen von Programmen

Über den Share Button kann ein Link zum Teilen der aktuellen Blöcke erstellt werden. Wann immer du dein Projekt mit anderen Teilen willst musst du nicht mehr eine XML Datei erstellen und verschicken sondern kannst einen Link erstellen, der direkt zu deinem Programm führt. Beachte, dass vor dem Teilen von Blöcken sämtliche sensiblen Daten, wie zum Beispiel Passwörter, Netzwerknamen, Lora oder openSenseMap Keys entfernt werden sollten. Die Links zum teilen von Programmen laufen nach 30 Tagen ab.

![](https://radosgw.public.os.wwu.de/pad/uploads/upload_a8dba6720fe2fb39cadf129d9bb04a62.png)

### Anzeigen von Hilfetexten

Wenn ein Block angeklickt und markiert ist (gelbe Umrandung) wird im Hilfefenster eine kurze Erläuterung und eine Quelle für weitere Informationen angezeigt.

## Fehler

Falls ihr Fehler findet legt bitte ein Issue in folgendem Repository an: [React-Ardublockly](https://github.com/sensebox/React-Ardublockly/issues)


`;

class News extends Component {
  componentDidMount() {
    // Ensure that Blockly.setLocale is adopted in the component.
    // Otherwise, the text will not be displayed until the next update of the component.
    this.forceUpdate();
  }

  render() {
    return (
      <div>
        <Breadcrumbs
          content={[{ link: this.props.location.pathname, title: "News" }]}
        />
        <Container fixed>
          <Typography variant="body1">
            <ReactMarkdown children={news}></ReactMarkdown>
          </Typography>
        </Container>
        {this.props.button ? (
          <Button
            style={{ marginTop: "20px" }}
            variant="contained"
            color="primary"
            onClick={() => {
              this.props.history.push(this.props.button.link);
            }}
          >
            {this.props.button.title}
          </Button>
        ) : (
          <Button
            style={{ marginTop: "20px" }}
            variant="contained"
            color="primary"
            onClick={() => {
              this.props.history.push("/");
            }}
          >
            {Blockly.Msg.button_back}
          </Button>
        )}
      </div>
    );
  }
}

export default withRouter(News);
