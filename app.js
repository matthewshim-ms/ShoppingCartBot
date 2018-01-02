const Bot = require('botbuilder-core').Bot;
const BotFrameworkAdapter = require('botbuilder-services').BotFrameworkAdapter;
const restify = require('restify');

// Create server
let server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function(){
    console.log(`${server.name} listening to ${server.url}`);
});

// Create adapter and listen to our servers '/api/messages' route.
const botFrameworkAdapter = new BotFrameworkAdapter({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_ID
});

server.post('/api/messages', botFrameworkAdapter.listen());

// Initialize bot by passing it adapter

const bot = new Bot(botFrameworkAdapter);

// define bot's onReceive message handler...'hello world' for now

bot.onReceive((context) => {
    context.reply(`Hello World`);
});

