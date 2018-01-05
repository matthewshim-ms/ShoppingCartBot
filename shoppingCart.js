let fs = require('fs');
const prompts = require('botbuilder-prompts');
// const menu = fs.readFileSync("./data/menu.json");

const menuItems = require('./data/menu.json');

let _ = require('underscore');

// let menuItems = JSON.parse(menu);
var menuKeys = Object.keys(menuItems);
var itemNames = menuKeys.map(id => menuItems[id].name);
console.log(itemNames);

module.exports = shoppingCart = {
    addItem: function(context, name, count) {
        if (!_.find(menuItems, item => item.name == name)) {
            throw `sorry ${name} is not on our menu`;
        }
        
        let cart = context.state.user.shoppingCart;
        if (!cart) {
            context.state.user.shoppingCart = cart = [];
        }

        let existingItem = _.find(cart, item => item.Name == name);
        if (existingItem) {
            existingItem.Count += count;
            context.reply(`Added: ${count} more ${name}`);
        }
        else if(cart.push(new ShoppingItem(name, count)) > 0){
            context.reply(`Added: ${count} - ${name}`);
        }
    },

    deleteItem: function(context, name) {
        let cart = context.state.user.shoppingCart;
        if (!cart) {
            throw "sorry you don't have anything in your cart yet";
        }

        let item = _.find(cart, item => item.Name == name);
        if (!item) {
            throw "sorry you don't have this item in your cart";
        }

       if(context.state.user.shoppingCart = _.without(cart, item)){
           context.reply(`Removed from cart: ${name}`)
       }
    },

    updateItem: function(context, name, count) {
        let cart = context.state.user.shoppingCart;
        if (!cart) {
            throw "sorry you don't have anything in your cart yet";
        }

        let item = _.find(cart, item => item.Name == name);
        if (!item) {
            throw "sorry you don't have this item in your cart";
        }
        else{
            context.reply(`Updated: ${count} - ${name}`)
        }

        item.Count = count;
    },

    clearCart: function(context){
        let cart = context.state.user.shoppingCart;
        if (!cart) {
            throw "sorry you don't have anything in your cart yet";
        }else{
            while(cart.length > 0)
                cart.pop();
            throw "Order Cleared";
        }
    },

    view: function(context) {
        
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