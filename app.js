const builder = require('botbuilder-core');
const services = require('botbuilder-services');
const restify = require('restify');
const prompts = require('botbuilder-prompts');
const McDdata = require('./data/menu.json');
const shoppingCart = require('./shoppingCart');
let cards = require('./cards');
const ai = require('botbuilder-ai'); // LUIS
const RegExpRecognizer = builder.RegExpRecognizer;


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

// Init recognizers
let recognizer = new RegExpRecognizer();
recognizer.addIntent('breakfastMenu', /breakfastMenu/i);
recognizer.addIntent('burgerMenu', /burgerMenu/i);

function initLuisRecognizer () {
    const luisAppId = "4fdecb57-2404-4d0f-954b-4696c41c9b5e";
    const subscriptionKey = "4941fa348c49494db1e8e8d2fd7adb2c";
    return new ai.LuisRecognizer(luisAppId, subscriptionKey);
}
let luisRecognizer = initLuisRecognizer();


function resolveOneFromLuis(luisData){

    let quantity;
    let itemName;
     
    for(let i = 0; i < luisData.entities.length; i++){
        if(luisData.entities[i].type == 'builtin.number'){
            quantity = parseInt(luisData.entities[i].value);
            break;
        }
        else{
            quantity = 1; 
        }
    }
    // For now, only handle one 'item'
    for(let i = 0; i < luisData.entities.length; i++){
        if(luisData.entities[i].type == 'ItemName')
            itemName = luisData.entities[i].resolution.values[0];
    }
    if(!itemName){
        throw "Sorry that item doesn't exist in our Menu";
    }

    return {itemName, quantity};
}

const bot = new builder.Bot(botFrameworkAdapter)
    .use(new builder.ConsoleLogger())
    .use(new builder.MemoryStorage())
    .use(new builder.BotStateManager())
    .use(recognizer)
    .onReceive((context) => {
        if(context.ifIntent('breakfastMenu')){
            context.reply(formatAdaptiveCard(cards.foodMenu.breakfast));
        }
        else if(context.ifIntent('burgerMenu')){
            context.reply(formatAdaptiveCard(cards.foodMenu.burgers));
        }

        if (context.request.type === builder.ActivityTypes.message) {
            return luisRecognizer.recognize(context)
            .then((results) => {

                let luisData = results[0];
                context.reply(`\nYour input generated the following LUIS results:`);
                context.reply(`Intent name: ${luisData.name}\n\nScore: ${luisData.score}`);

                // For testing, delete when in PROD
                luisData.entities.forEach((entity) => {

                    context.reply(`Detected entity: \n\nType: ${entity.type}\n\nValue: ${entity.value}\n\nScore: ${entity.score}`);
                });

                if(luisData.name == 'CheckMenu'){

                    context.reply(formatAdaptiveCard(cards.foodMenu));

                }else if(luisData.name == 'ViewCart'){
                    console.log(context.state.user.shoppingCart);

                }else if(luisData.name == 'AddItem'){

                    let item = resolveOneFromLuis(luisData);
           
                    // add Item to cart
                    shoppingCart.addItem(context, item.itemName, item.quantity);

                }else if(luisData.name == 'CheckOut'){

                }else if(luisData.name == 'Delete'){

                    let item = resolveOneFromLuis(luisData);

                    shoppingCart.deleteItem(context, item.itemName);

                }else if(luisData.name == 'UpdateItem'){
                    
                    let item = resolveOneFromLuis(luisData);

                    // Update Item in cart
                    shoppingCart.updateItem(context, item.itemName, item.quantity);
                }
                
            })
            .catch((err) => {
                context.reply('There was an error connecting to the LUIS API');
                context.reply(err);
            });
        } else {
            context.reply(`[${context.request.type} event detected]`);
        }
    });