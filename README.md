# React Ardublockly

<div align="center"> 
<img src="/src/components/sensebox_logo.svg?raw=true" height="128" alt="senseBox Logo"/>
</div>

[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR-BADGE-ID/deploy-status)](https://app.netlify.com/sites/sensebox-ardublockly/deploys)
[![GitHub license](https://img.shields.io/github/license/sensebox/React-Ardublockly)](https://github.com/sensebox/React-Ardublockly/blob/master/LICENSE)

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
VITE_COMPILER_URL=https://compiler.sensebox.de
```

## 📝 Development Guidelines

### Code Style

- We use [Prettier](https://prettier.io) for consistent formatting
- Configuration in `.prettierrc.json`
- ESLint for JavaScript/React best practices

### Branching Strategy
If you want to contribute **please use the development branch** ! The main branch is only used for production and may be outdated!
- `main`: Production branch 
- `development`: Development branch
- Feature branches: `feature/name-of-feature`
- Bugfix branches: `bugfix/name-of-bug`

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

- [User Manual](https://docs.sensebox.de/docs/category/blockly-2)
- [Hardware-Glossar](https://docs.sensebox.de/docs/category/glossar)

## 🌐 Demo

A live demo of the current version can be found at [https://blockly.sensebox.de/](https://blockly.sensebox.de/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Blockly](https://developers.google.com/blockly) - Google's visual programming language
- [Create React App](https://github.com/facebook/create-react-app) - React project template
- [Material-UI](https://material-ui.com/) - React UI Framework
