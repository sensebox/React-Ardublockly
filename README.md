# React Ardublockly

<img src="/src/components/sensebox_logo.svg?raw=true" height="128" alt="senseBox Logo"/>

[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR-BADGE-ID/deploy-status)](https://app.netlify.com/sites/sensebox-ardublockly/deploys)
[![GitHub license](https://img.shields.io/github/license/sensebox/React-Ardublockly)](https://github.com/sensebox/React-Ardublockly/blob/master/LICENSE)

<div align="center">

[🇩🇪 Deutsch](#deutsch) | [🇬🇧 English](#english)

</div>

---

<a name="deutsch"></a>
# 🇩🇪 Deutsch

Eine moderne, React-basierte Version der [senseBox](https://sensebox.de) Ardublockly-Umgebung. Dieses Projekt ist die Weiterentwicklung von [blockly.sensebox.de](https://blockly.sensebox.de/ardublockly/?lang=de&board=sensebox-mcu) und bietet eine verbesserte Benutzeroberfläche sowie neue Funktionen.

## 🚀 Features

- 📱 Moderne, responsive Benutzeroberfläche
- 🧩 Visuelle Programmierung mit Blockly
- 💾 Automatisches Speichern der Projekte
- 🔄 Einfacher Code-Export
- 📊 Unterstützung für verschiedene senseBox-Boards
- 🌍 Mehrsprachige Benutzeroberfläche (Deutsch/Englisch)
- 📱 Integration mit der senseBox Connect App

## 🛠 Installation

### Voraussetzungen

- [Node.js](https://nodejs.org/en/) (Version 10.x oder höher)
- npm (wird mit Node.js installiert)
- Git (optional, für Versionskontrolle)

### Entwicklungsumgebung einrichten

1. Repository klonen oder herunterladen:
   ```bash
   git clone https://github.com/sensebox/React-Ardublockly.git
   # oder
   # Direkter Download: https://github.com/sensebox/React-Ardublockly/archive/master.zip
   ```

2. In das Projektverzeichnis wechseln:
   ```bash
   cd React-Ardublockly
   ```

3. Abhängigkeiten installieren:
   ```bash
   npm ci   # Empfohlen für reproduzierbare Builds
   # oder
   npm install   # Alternative
   ```

4. Entwicklungsserver starten:
   ```bash
   npm start
   ```

5. Browser öffnen und zu [http://localhost:3000](http://localhost:3000) navigieren

## 🔧 Konfiguration

### Board-Auswahl

- **senseBox MCU**: Standard-Board mit Arduino-Kompatibilität
- **senseBox MCU-S2**: ESP32-basiertes Board mit erweiterter Funktionalität

### Compiler-Einstellungen

Die Compiler-URL kann in der `.env`-Datei konfiguriert werden:
```
REACT_APP_COMPILER_URL=https://compiler.sensebox.de
```

## 📝 Development Guidelines

### Code Style

- Wir verwenden [Prettier](https://prettier.io) für einheitliche Formatierung
- Konfiguration in `.prettierrc.json`
- ESLint für JavaScript/React Best Practices

### Branching-Strategie

- `master`: Produktions-Branch
- `development`: Entwicklungs-Branch
- Feature-Branches: `feature/name-der-funktion`
- Bugfix-Branches: `bugfix/name-des-bugs`

### Commit-Nachrichten

Bitte folgen Sie dem Format:
```
[Bereich] Kurze Beschreibung

- Detaillierte Änderung 1
- Detaillierte Änderung 2
```

## 🤝 Mitwirken

1. Fork erstellen
2. Feature Branch erstellen (`git checkout -b feature/AmazingFeature`)
3. Änderungen committen (`git commit -m '[Bereich] Füge neue Funktion hinzu'`)
4. Branch pushen (`git push origin feature/AmazingFeature`)
5. Pull Request erstellen

## 🐛 Bekannte Probleme

- Redux DevTools muss installiert oder die entsprechende Zeile in `store.js` auskommentiert sein
- Einige Boards benötigen spezielle Treiber für die USB-Verbindung

## 📚 Dokumentation

- [Benutzerhandbuch](https://docs.sensebox.de/blockly/)
- [API-Dokumentation](https://api.docs.sensebox.de/)
- [Hardware-Dokumentation](https://docs.sensebox.de/hardware/overview/)

## 🌐 Demo

Eine Live-Demo der aktuellen Version finden Sie unter [https://sensebox-ardublockly.netlify.app/](https://sensebox-ardublockly.netlify.app/)

---

<a name="english"></a>
# 🇬🇧 English

A modern, React-based version of the [senseBox](https://sensebox.de) Ardublockly environment. This project is the continuation of [blockly.sensebox.de](https://blockly.sensebox.de/ardublockly/?lang=de&board=sensebox-mcu) and offers an improved user interface and new features.

## 🚀 Features

- 📱 Modern, responsive user interface
- 🧩 Visual programming with Blockly
- 💾 Automatic project saving
- 🔄 Easy code export
- 📊 Support for various senseBox boards
- 🌍 Multilingual interface (German/English)
- 📱 Integration with senseBox Connect App

## 🛠 Installation

### Prerequisites

- [Node.js](https://nodejs.org/en/) (Version 10.x or higher)
- npm (comes with Node.js)
- Git (optional, for version control)

### Setting up the Development Environment

1. Clone or download repository:
   ```bash
   git clone https://github.com/sensebox/React-Ardublockly.git
   # or
   # Direct download: https://github.com/sensebox/React-Ardublockly/archive/master.zip
   ```

2. Change to project directory:
   ```bash
   cd React-Ardublockly
   ```

3. Install dependencies:
   ```bash
   npm ci   # Recommended for reproducible builds
   # or
   npm install   # Alternative
   ```

4. Start development server:
   ```bash
   npm start
   ```

5. Open browser and navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Board Selection

- **senseBox MCU**: Standard board with Arduino compatibility
- **senseBox MCU-S2**: ESP32-based board with extended functionality

### Compiler Settings

The compiler URL can be configured in the `.env` file:
```
REACT_APP_COMPILER_URL=https://compiler.sensebox.de
```

## 📝 Development Guidelines

### Code Style

- We use [Prettier](https://prettier.io) for consistent formatting
- Configuration in `.prettierrc.json`
- ESLint for JavaScript/React best practices

### Branching Strategy

- `master`: Production branch
- `development`: Development branch
- Feature branches: `feature/name-of-feature`
- Bugfix branches: `bugfix/name-of-bug`

### Commit Messages

Please follow this format:
```
[Area] Brief description

- Detailed change 1
- Detailed change 2
```

## 🤝 Contributing

1. Create a fork
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m '[Area] Add amazing feature'`)
4. Push branch (`git push origin feature/AmazingFeature`)
5. Create Pull Request

## 🐛 Known Issues

- Redux DevTools must be installed or the corresponding line in `store.js` must be commented out
- Some boards require special drivers for USB connection

## 📚 Documentation

- [User Manual](https://docs.sensebox.de/blockly/)
- [API Documentation](https://api.docs.sensebox.de/)
- [Hardware Documentation](https://docs.sensebox.de/hardware/overview/)

## 🌐 Demo

A live demo of the current version can be found at [https://sensebox-ardublockly.netlify.app/](https://sensebox-ardublockly.netlify.app/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Blockly](https://developers.google.com/blockly) - Google's visual programming language
- [Create React App](https://github.com/facebook/create-react-app) - React project template
- [Material-UI](https://material-ui.com/) - React UI Framework
