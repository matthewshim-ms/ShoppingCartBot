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
        let cart = context.state.user.shoppingCart;
        if (!cart) {
            context.state.user.shoppingCart = cart = [];
        }

        let existingItem = _.find(cart, item => item.Name == name);
        if (existingItem) {
            existingItem.Count += count;
            context.reply(`${count} ${item.Name}added to cart`);
        }

        if (!_.find(menuItems, item => item.name == name)) {
            throw `sorry ${name} is not on our menu`;
        }

        cart.push(new ShoppingItem(name, count));
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

        context.state.user.shoppingCart = _.without(cart, item);
    },

    view: function(context) {

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

        item.Count = count;
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