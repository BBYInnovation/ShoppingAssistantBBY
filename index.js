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
const PRINTER = 'ProductPrinter';
const USETYPE = 'Printer.UseType';
const MODERATEUSE = 'Printer.UseType.ModerateUse';
const SCANTYPE = 'Printer.UseType.ModerateUse.ScanType';
const WIFITYPE = 'Printer.UseType.ModerateUse.ScanType.WifiType';
const PRODUCT_SELECTED = 'Printer.UseType.ModerateUse.ScanType.WifiType.ProductSelected';
const CHECKOUT = 'Printer.UseType.ModerateUse.ScanType.WifiType.ProductSelected.CheckOut';
const END = 'Printer.UseType.ModerateUse.ScanType.WifiType.ProductSelected.CheckOut.End';
const NAME = 'action.name';
const GETNAME = 'input.name';

const PAGE_ACCESS_TOKEN = 'EAABrwqlWAPwBALcI3btkbhDnPAjM2aM5mRAwLhguPpZBNcfkTwjKMk5sYJoX7G73D4NVgdTqQLMVele1ZA9uwKpEFGlyTZC0sKG8AiWQgh0vvHvi097smF35tQ8nTZBV82zn6IShX3woZApBoBN0Eo5LCBjVNUAh2j4lK4ZCeUmQZDZD';
var senderID = '';
var data = '';

app.set('port', process.env.PORT || 5000);
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(express.static('public'));

/*
* HTTP Cloud Function.
*/
app.post('/helloHttp', function(request, response) {
  console.log("Inside /helloHttp");
  var req = request.body;
  console.log("Req: ", req);

  data = req.originalRequest.data;
  console.log("data: ", data);

  senderID = data.sender.id;
  console.log("SenderID: ", senderID);

  const appAi = new ApiAiApp({request: request, response: response});
  const actionMap = new Map();
  actionMap.set(WELCOME_INTENT, welcomeIntent);
  actionMap.set(PRINTER, productPrinter);
  actionMap.set(USETYPE, chooseUseType);
  actionMap.set(MODERATEUSE, chooseModerateUse);
  actionMap.set(SCANTYPE, chooseScanType);
  actionMap.set(WIFITYPE, chooseWiFiType);
  actionMap.set(PRODUCT_SELECTED, productSelected);
  actionMap.set(CHECKOUT, checkOut);
  actionMap.set(END, endIntent);
  actionMap.set(NAME, getName);
  actionMap.set(GETNAME, selectedName);

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

function getName (app) {
  console.log("Inside getName");
  app.setContext('Select_Name');
  sendButtonMessage(senderID);
  /*app.ask(app.buildRichResponse()
    .addSimpleResponse({speech: 'Howdy! I can tell you fun facts about ' +
        'almost any number like 0, 42, or 100. What number do you have ' +
        'in mind?',
      displayText: 'Howdy! I can tell you fun facts about almost any ' +
        'number. What number do you have in mind?'})
    .addSuggestions(
      ['0', '42', '100', 'Never mind'])
    .addSuggestionLink('Suggestion Link', 'https://assistant.google.com/')
  );*/
  //app.setContext('Input_Name', 5);
}

function selectedName(appAi) {
  console.log("Inside selectedName");
  appAi.tell("You have said your name is: " + data.message.quick_reply.payload);
}







function welcomeIntent (appAi) {
  console.log("Inside welcomeIntent");
  appAi.tell('I am your BestBuy virtual In-Home Assistant. I can help you choose your home appliances. How may I help you today?');
}

function productPrinter (appAi) {
  console.log("Inside productPrinter");
  //appAi.tell('Sure. I can help you with that. Do you want it for Home Use or Office Use?');
  var messageData = {
    recipient: {
      id: senderID
    },
    "message":{
      "text": "Sure. I can help you with that. \n How do you plan on using it?",
      "quick_replies":[
        {
          "content_type":"text",
          "title":"For Personal use",
          "payload":"PRINTER_USE_TYPE_PERSONAL"
        },
        {
          "content_type":"text",
          "title":"For Professional use",
          "payload":"PRINTER_USE_TYPE_PROFESSIONAL"
        }]
    }
  };

  callSendAPI(messageData);
}

function chooseUseType (appAi) {
  console.log("Inside chooseUseType")
  //appAi.tell('Cool. Would you print a lot every day? Like more than 50 pages per week?');
  var messageData = {
    recipient: {
      id: senderID
    },
    "message":{
      "text": "Cool.. :) \n Please let me know how many pages you plan on printing on a weekly basis",
      "quick_replies":[
        {
          "content_type":"text",
          "title":"Less than 10",
          "payload":"PRINTER_PAPER_LESS_THAN_10"
        },
        {
          "content_type":"text",
          "title":"Less than 100",
          "payload":"PRINTER_PAPER_LESS_THAN_100"
        },
        {
          "content_type":"text",
          "title":"More than 100",
          "payload":"PRINTER_PAPER_MORE_THAN_100"
        }]
    }
  };

  callSendAPI(messageData);
}

function chooseModerateUse (appAi) {
  console.log("Inside chooseModerateUse")
  appAi.tell('Would you also want the printer to scan pages?');
}

function chooseScanType (appAi) {
  console.log("Inside chooseScanType")
  appAi.tell('Do you need the printer to print over the WiFi?');
}

function chooseWiFiType (appAi) {
  console.log("Inside chooseWiFiType")
  appAi.tell('Check this printer model which matches your criteria! Can I add this to your Best Buy cart?');
  sendGenericMessage(senderID);
}

function productSelected (appAi) {
  console.log("Inside productSelected")
  appAi.tell('Great! Product added to your BestBuy cart. Can I checkout this item for you?');
}

function checkOut (appAi) {
  console.log("Inside checkOut")
  appAi.tell('Item checked out. Is there anything else I can help you with?');
}

function endIntent (appAi) {
  console.log("Inside endIntent")
  appAi.tell('Thanks for shopping with Best Buy. Have a great day!');
}





function sendGenericMessage(recipientId) {
  console.log("RecipientID: ", recipientId)
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "rift",
            subtitle: "Printer",
            item_url: "https://www.bestbuy.com/site/hp-officejet-pro-6978-wireless-all-in-one-instant-ink-ready-printer/5119600.p?skuId=5119600",
            image_url: "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/5119/5119600_sd.jpg;maxHeight=550;maxWidth=642",
            buttons: [{
              type: "web_url",
              url: "https://www.bestbuy.com/site/hp-officejet-pro-6978-wireless-all-in-one-instant-ink-ready-printer/5119600.p?skuId=5119600",
              title: "Open Web URL"
            }],
          }]
        }
      }
    }
  };
  callSendAPI(messageData);
  }

  function sendButtonMessage(recipientId) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      "message":{
        "text": "Here's a quick reply!",
        "quick_replies":[
          {
            "content_type":"text",
            "title":"Joe",
            "payload":"NAME_JOE"
          },
          {
            "content_type":"text",
            "title":"Arun",
            "payload":"NAME_ARUN"
          }]
      }
    };

    callSendAPI(messageData);
  }

  function callSendAPI(messageData) {
    request({
      uri: 'https://graph.facebook.com/v2.6/me/messages',
      qs: { access_token: PAGE_ACCESS_TOKEN },
      method: 'POST',
      json: messageData

    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var recipientId = body.recipient_id;
        var messageId = body.message_id;

        if (messageId) {
          console.log("Successfully sent message with id %s to recipient %s",
            messageId, recipientId);
        } else {
        console.log("Successfully called Send API for recipient %s",
          recipientId);
        }
      } else {
        console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
      }
    });
  }

module.exports = app;
