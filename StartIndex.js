
'use strict';

//let ApiAiApp = require('actions-on-google').ApiAiApp;
const ApiAiApp = require('actions-on-google').ApiAiApp;
const bodyParser = require('body-parser');

const app = new ApiAiApp({request, response});
const WELCOME_INTENT = 'input.welcome';
const NUMBER_INTENT = 'input.number';

function welcomeIntent (app) {
  app.ask('I am your virtual In-Home Assistant. I can help you choose your home appliances. How may I help you today?');
}

function buyPrinter (app) {
  app.ask('Do you want this for home use or office use?');
}

const actionMap = new Map();
actionMap.set(WELCOME_INTENT, welcomeIntent);
actionMap.set(PRINTER, buyPrinter);
app.handleRequest(actionMap);

module.exports=StartIndex;
