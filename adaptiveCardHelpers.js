let _ = require('underscore');
const menuItems = require('./data/menu.json');

module.exports = adaptiveCardHelper = {
    welcomeMessage: function(){
        let adaptiveCard = {
            "type" : "message",
            "text" : "McDonalds: Welcome to McDonald's",
            "attachments": [{
                "contentType": "application/vnd.microsoft.card.adaptive",
                "content": {
                    "type": "AdaptiveCard",
                    "version": "1.0",
                    "body": [
                    {
                        "type": "Image",
                        "size": "auto",
                        "url": "https://www.mcdonalds.com/is/image/content/dam/usa/documents/careers/benefits2.jpg"
                    },
                    {
                        "type": "TextBlock",
                        "size": "large",
                        "weight": "bolder",
                        "horizontalAlignment": "center",
                        "isSubtle": true,
                        "wrap": true,
                        "text": "I'm loving it!"
                    },
                    {
                        "type": "TextBlock",
                        "weight": "bolder",
                        "wrap": true,
                        "text": "How may I take your order?"
                    },
                    {
                        "type": "TextBlock",
                        "wrap": true,
                        "text": "You can say things like, 'Add 2 BigMac', 'burger menu', or 'show cart'"
                    }

                    ]
                }
            }]
        }
        return adaptiveCard;
    },

    formatAdaptiveCard: function(card){
        let adaptiveCard = {
            "type" : "message",
            "text" : "McDonald's: " + card.name,
            "attachments": [{
                "contentType": "application/vnd.microsoft.card.adaptive",
                "content": card.content
            }]
        }
        return adaptiveCard;
    },

    formatAdaptiveCardShoppingCart: function(context){
        
        let currentCart = context.state.user.shoppingCart
        let body = [
            {
                "type": "Container",
                "items": [
                    {
                        "type": "TextBlock",
                        "text": "Your McDonalds Order",
                        "weight": "bolder",
                        "size": "medium"
                    }
                ]
            }
        ];
    
        // go through cart and add items to card

        // Cart is empty
        if(!currentCart || currentCart.length == 0){

            let item = {
                "type": "TextBlock",
                "text": "Your order is currently empty",
                "weight": "bolder",
                "spacing": "medium"
            }
            body[0].items.push(item);
        }
        else  // cart is not empty
        {      
            let totalCost = 0;
            for(let i = 0; i < currentCart.length; i++){
        
                // Gets the image URL from the Menu
                let menuItem = _.find(menuItems, item => item.name == currentCart[i].Name);
                let imageURL = menuItem.imageURL;
                let price = menuItem.price * currentCart[i].Count;
                totalCost += price;

                let addItem = {
                    "type": "Container",
                    "items": [
                        {
                        "type": "ColumnSet",
                        "columns":[
                        {
                            "type": "Column",
                            "width": "auto",
                            "items": [
                            {
                                "type": "Image",
                                "url": imageURL,
                                "size": "medium",
                                "spacing": "4"
                            }
                            ]
                        },
                        {
                            "type": "Column",
                            "width": "auto",
                            "items": [
                            {
                                "type": "TextBlock",
                                "wrap": true,
                                "color": "accent",
                                "weight": "bolder",
                                "text": `${currentCart[i].Name} - **Qty: ${currentCart[i].Count}** - $ ${price}`,
                            }
                            ]
                        },
                        ]
                    }
                    ]
                }
                body[0].items.push(addItem);
            }

            // add totalCost to card
            let costCard = {
                "type": "TextBlock",
                "weight": "bolder",
                "color": "accent",
                "text": `Total Cost: $ ${totalCost}`
            }
            body[0].items.push(costCard);
        }
        let adaptiveCard = {
            "type": "message",
            "text" : "McDonald's: Order Details",
            "attachments": [{
                "contentType": "application/vnd.microsoft.card.adaptive",
                "content": {
                    "type" : "AdaptiveCard",
                    "version": "1.0",
                    "body": body
                }
            }]
        }
        return adaptiveCard;
    },

    formatReceiptCard : function(context){

        let shoppingCart = context.state.user.shoppingCart;
        let totalCost = 0.00;

        let items = [];

        for(let i = 0; i < shoppingCart.length; i++){

            let menuItem = _.find(menuItems, item => item.name == shoppingCart[i].Name);
            let imageURL = menuItem.imageURL;
            let price = menuItem.price * shoppingCart[i].Count;
            totalCost += price;

            let receiptItem = {
                "title": `${menuItem.name}`,
                "text": `${menuItem.tagLine}`,
                "image": {
                    "url": imageURL,
                    "tap": {
                        "type": "openUrl",
                        "title": "Tapped it!",
                        "value": "testurl1.html"
                    }
                },
                price: `$ ${price}`
            }
            items.push(receiptItem);
        }

        let receiptCard = {
            "type": "message",
            "test": "Order Receipt",
            "attachments": [{
                "contentType" : "application/vnd.microsoft.card.receipt",
                "content": {
                    "title": "Your Order Receipt",
                    "subtitle": "this is subtitle",
                    "items": items          
                }
            }],
            "total": `$ - ${totalCost}`
        }

        return receiptCard;
    }
}