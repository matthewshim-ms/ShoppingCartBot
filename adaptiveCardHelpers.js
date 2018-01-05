let _ = require('underscore');
const menuItems = require('./data/menu.json');

module.exports = adaptiveCardHelper = {
    welcomeMessage: function(){
        let adaptiveCard = {
            "type" : "message",
            "text" : "McDonalds",
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
                        "text": "Welcome to McDonald's",
                        "wrap": true
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
            "text" : "Example: " + card.name,
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
            for(let i = 0; i < currentCart.length; i++){
        
                // Gets the image URL from the Menu
                let menuItem = _.find(menuItems, item => item.name == currentCart[i].Name);
                let imageURL = menuItem.imageURL;
        
                let imageThumb = {
                    "type": "Image",
                    "url": imageURL,
                    "size": "large",
                    "spacing": 4
                }
                body[0].items.push(imageThumb);
        
                let item = {
                    "type": "TextBlock",
                    "text": `${currentCart[i].Name} - Qty: ${currentCart[i].Count}`,
                    "weight": "bolder",
                    "spacing": "medium"
                }
                body[0].items.push(item);
            }
        }

        let adaptiveCard = {
            "type": "message",
            "text" : "Your Order",
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
    }
}