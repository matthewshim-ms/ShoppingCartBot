let fs = require('fs');
const prompts = require('botbuilder-prompts');
const menu = fs.readFileSync("./data/menu.json");

let menuItems = JSON.parse(menu);
var menuKeys = Object.keys(menuItems);
module.exports = shoppingCart = {
    addItem: function(context, name, count){
        
        // TODO: more error handling,

        let cart = context.state.user.shoppingCart;
        if(!cart){
            context.state.user.shoppingCart = cart = [];
        }

        cart.push(cart);
        context.reply(`Added `);
    },

    deleteItem: function(context, name){

    },

    view: function(context){

    },

    updateItem: function(context, name, count){

    },

    checkout: function(context){

    }
}

class ShoppingItem {
    constructor (name, count) {
        this.Name = name;
        this.Count = count;
    }
}
// END 