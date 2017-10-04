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

function choosePrinterType (appAi) {
  console.log("Inside choosePrinterType")
  appAi.askWithList(appAi.buildRichResponse()
    .addSimpleResponse('Alright')
    .addSuggestions(
      ['Basic Card', 'List', 'Carousel', 'Suggestions']),
    // Build a list
    appAi.buildList('Things to learn about')
    // Add the first item to the list
    .addItems(appAi.buildOptionItem('MATH_AND_PRIME',
      ['math', 'math and prime', 'prime numbers', 'prime'])
      .setTitle('Math & prime numbers')
      .setDescription('42 is an abundant number because the sum of its ' +
        'proper divisors 54 is greater…')
      .setImage('https://goshopping-130590.herokuapp.com/assets/rift.png', 'Math & prime numbers'))
    // Add the second item to the list
    .addItems(appAi.buildOptionItem('EGYPT',
      ['religion', 'egpyt', 'ancient egyptian'])
      .setTitle('Ancient Egyptian religion')
      .setDescription('42 gods who ruled on the fate of the dead in the ' +
        'afterworld. Throughout the under…')
      .setImage('https://goshopping-130590.herokuapp.com/assets/rift.png', 'Egypt')
    )
    // Add third item to the list
    .addItems(appAi.buildOptionItem('RECIPES',
      ['recipes', 'recipe', '42 recipes'])
      .setTitle('42 recipes with 42 ingredients')
      .setDescription('Here\'s a beautifully simple recipe that\'s full ' +
        'of flavor! All you need is some ginger and…')
      .setImage('https://goshopping-130590.herokuapp.com/assets/rift.png', 'Recipe')
    )
  );
}

module.exports = app;
