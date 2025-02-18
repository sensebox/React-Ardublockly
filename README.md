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

## Troubleshoot

Ensure that line 14 in [store.js](https://github.com/sensebox/React-Ardublockly/blob/master/src/store.js#L14) is commented out or otherwise you have installed [Redux DevTools Extension](http://extension.remotedev.io/).

## Demo

A demo of the current status of the master branch can be accessed via [https://blockly-react.netlify.app/](https://blockly-react.netlify.app/) :rocket:.

## Coding Guidelines

We use the code formatter [prettier](https://prettier.io) for consistancy. The coresponding formatting settings can be found in the `.prettierrc.json` file. Possible options can be found [here](https://prettier.io/docs/en/options) but should only be changed if necessary.
