const
  bodyParser = require('body-parser'),
  config = require('config'),
  crypto = require('crypto'),
  express = require('express'),
  https = require('https'),
  request = require('request'),
  ApiAiApp = require('actions-on-google').ApiAiApp;
var app = express();

const WELCOME_INTENT = 'input.welcome';
const PRINTER = 'input.printer';

app.set('port', process.env.PORT || 5000);
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(express.static('public'));

/*
* HTTP Cloud Function.
*/
app.post('/helloHttp', function(request, response) {
  console.log("Inside /helloHttp");
  const appAi = new ApiAiApp({request: request, response: response});
  const actionMap = new Map();
  actionMap.set(WELCOME_INTENT, welcomeIntent);
  actionMap.set(PRINTER, choosePrinterType);
  appAi.handleRequest(actionMap);
});

app.get('/', function(request, response) {
	console.log("Inside get");
  console.log("New deployment method")
  res.sendStatus(200);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


function welcomeIntent (appAi) {
  console.log("Inside welcomeIntent");
  appAi.tell('I am your BestBuy virtual In-Home Assistant. I can help you choose your home appliances. How may I help you today?');
}

function buyPrinter (appAi) {
  console.log("Inside buyPrinter");
  appAi.ask('Sure, I can help you with that. \nDo you want this for',['home use', 'office use']);

}

function choosePrinterType (app) {
  app.askWithCarousel('Sure, I can help you with that.',
    app.buildCarousel()
     .addItems([
       app.buildOptionItem(HOME_PRINTER,
         ['synonym of KEY_ONE 1', 'synonym of KEY_ONE 2'])
         .setTitle('Home Printer'),
       app.buildOptionItem(OFFICE_PRINTER,
         ['synonym of KEY_TWO 1', 'synonym of KEY_TWO 2'])
         .setTitle('Office Printer'),
     ]));
}

module.exports = app;
