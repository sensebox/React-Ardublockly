 <img src="/src/components/sensebox_logo.svg?raw=true" height="128" alt="senseBox Logo"/>

# React Ardublockly

This repository contains the source code and documentation of [sensebox-ardublockly](https://sensebox-ardublockly.netlify.app/).

This project was created with [Create React App](https://github.com/facebook/create-react-app) and represents the continuation or improvement of [blockly.sensebox.de](https://blockly.sensebox.de/ardublockly/?lang=de&board=sensebox-mcu).

## Getting Started

1. [Download](https://github.com/sensebox/React-Ardublockly/archive/master.zip) or clone the GitHub Repository `git clone https://github.com/sensebox/React-Ardublockly` and checkout to branch `master`.

2. install [Node.js v10.xx](https://nodejs.org/en/) on your local machine

3. open shell and navigate inside folder `React-Ardublockly`

   - run `npm ci`
   - run `npm start`

4. open [localhost:3000](http://localhost:3000)

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

A demo of the current status of the master branch can be accessed via [https://blockly-react.netlify.app/](https://blockly-react.netlify.app/) :rocket:.

## Coding Guidelines

We use the code formatter [prettier](https://prettier.io) for consistancy. The coresponding formatting settings can be found in the `.prettierrc.json` file. Possible options can be found [here](https://prettier.io/docs/en/options) but should only be changed if necessary.
