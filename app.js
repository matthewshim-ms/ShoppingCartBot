const builder = require('botbuilder-core');
const services = require('botbuilder-services');
const restify = require('restify');
const prompts = require('botbuilder-prompts');
const McDdata = require('./data/menu.json');
const shoppingCart = require('./shoppingCart');
let cards = require('./cards');

// for LUIS
const ai = require('botbuilder-ai');


// Create server
let server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create adapter
const botFrameworkAdapter = new services.BotFrameworkAdapter({ 
    appId: process.env.MICROSOFT_APP_ID, 
    appPassword: process.env.MICROSOFT_APP_PASSWORD });
server.post('/api/messages', botFrameworkAdapter.listen());

// Create Recognizer + intents
let recognizer = new builder.RegExpRecognizer();
recognizer.addIntent('CancelIntent', /(quit|cancel)/i);
recognizer.addIntent('MenuIntent', /(menu|Menu)/i);
recognizer.addIntent('ViewBurgers', /(burger|burgers)/i);
recognizer.addIntent('AddItemIntent', /(add|Add)/i);
recognizer.addIntent('DeleteIntent', /(delete|remove)/i);
recognizer.addIntent('CheckoutIntent', /(done|checkout|pay)/i);
recognizer.addIntent('UpdateItem', /(update)/i); 

// Initialize bot by passing it adapter
// - Add a logger to monitor bot.
// - Add storage so that we can track conversation & user state.
// - Add a receiver to process incoming activities.

function formatAdaptiveCard(card){
    let adaptiveCard = {
        "type" : "message",
        "text" : "Example: " + card.name,
        "attachments": [{
            "contentType": "application/vnd.microsoft.card.adaptive",
            "content": card.content
        }]
    }
    return adaptiveCard;
}

function initLuisRecognizer () {
    const luisAppId = "4fdecb57-2404-4d0f-954b-4696c41c9b5e";
    const subscriptionKey = "4941fa348c49494db1e8e8d2fd7adb2c";
    return new ai.LuisRecognizer(luisAppId, subscriptionKey);
}
let luisRecognizer = initLuisRecognizer();


const bot = new builder.Bot(botFrameworkAdapter)
    .use(new builder.ConsoleLogger())
    .use(new builder.MemoryStorage())
    .use(new builder.BotStateManager())
    .use(recognizer)
    .onReceive((context) => {
        if (context.request.type === builder.ActivityTypes.message) {
            return luisRecognizer.recognize(context)
            .then((results) => {
                let luisData = results[0];
                context.reply(`\nYour input generated the following LUIS results:`);
                context.reply(`Intent name: ${luisData.name}\n\nScore: ${luisData.score}`);
                luisData.entities.forEach((entity) => {
                    context.reply(`Detected entity: \n\nType: ${entity.type}\n\nValue: ${entity.value}\n\nScore: ${entity.score}`);
                });


            })
            .catch((err) => {
                context.reply('There was an error connecting to the LUIS API');
                context.reply(err);
            });

           let count = context.state.conversation.count || 1;

           // handle intents
        //    if(context.ifIntent('MenuIntent')){
        //        // TODO: Edit foodMenu.json schema 
        //        context.reply(formatAdaptiveCard(cards.foodMenu));
        //    }
        //    else if(context.ifIntent('ViewBurgers')){
        //        // TODO: serve adaptive card with just burgers as proof of concept? 

        //    }
        //    else if(context.ifIntent('CancelIntent')){
        //        context.reply('Cancelling Order!');
        //        context.endOfConversation();
        //    }else if(context.ifIntent('AddItemIntent')){
                

        //         context.reply('Adding to cart...');

        //    }else if(context.ifIntent('DeleteIntent')){
        //        context.reply('deleting item from your shopping cart...');

        //    }else if(context.ifIntent('CheckoutIntent')){
        //         context.reply('Order complete....processing payment...');
        //         context.endOfConversation();
        //    }
        } else {
            context.reply(`[${context.request.type} event detected]`);
        }
    });