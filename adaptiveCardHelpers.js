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
                "weight": "bolder",
                "spacing": "medium",
                "color": "attention",
                "text": "Your order is currently empty"
            }
            body[0].items.push(item);
        }
        else  // cart is not empty
        {      
            
            for(let i = 0; i < currentCart.length; i++){
        
                // Gets the image URL from the Menu
                let menuItem = _.find(menuItems, item => item.name == currentCart[i].Name);
                let imageURL = menuItem.imageURL;
        
                let addItem = {
                    "type": "Container",
                    "separator": true,
                    "spacing": "large",
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
                                "color": "good",
                                "weight": "bolder",
                                "text": `${currentCart[i].Name} - Qty: ${currentCart[i].Count}`,
                            }
                            ]
                        }
                        ]
                    }
                    ]
                }
                body[0].items.push(addItem);
            }
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
    }
}