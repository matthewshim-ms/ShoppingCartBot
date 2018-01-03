const builder = require('botbuilder-core');
const services = require('botbuilder-services');
const restify = require('restify');
const prompts = require('botbuilder-prompts');
const McDdata = require('./data/menu.json');

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
recognizer.addIntent('AddItemIntent', /(add|Add)/i); 


// Initialize bot by passing it adapter
// - Add a logger to monitor bot.
// - Add storage so that we can track conversation & user state.
// - Add a receiver to process incoming activities.
const bot = new builder.Bot(botFrameworkAdapter)
    .use(new builder.ConsoleLogger())
    .use(new builder.MemoryStorage())
    .use(new builder.BotStateManager())
    .use(recognizer)
    .onReceive((context) => {
        if (context.request.type === builder.ActivityTypes.message) {
           let count = context.state.conversation.count || 1;

           // handle intents
           if(context.ifIntent('MenuIntent')){
               
           }
           else if(context.ifIntent('CancelIntent')){
               context.reply('Cancelling Order!');
               context.endOfConversation();
           }

          

        } else {
            context.reply(`[${context.request.type} event detected]`);
        }
    });