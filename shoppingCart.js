let fs = require('fs');
const prompts = require('botbuilder-prompts');
const menu = fs.readFileSync("./data/menu.json");

let menuItems = JSON.parse(menu);
var menuKeys = Object.keys(menuItems);

module.exports = shoppingCart = {
    addItem: function(context, item){
        
        // TODO: more error handling,

        let cart = context.state.user.shoppingCart;
        if(!cart){
            context.state.user.shoppingCart = cart = [];
        }

        cart.push(cart);
        context.reply(`Added `);
    }


}
// END 