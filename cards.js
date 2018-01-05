/* Cards definitions */

module.exports = {
    foodMenu: {
        breakfast: {
            name: "Breakfast Menu",
            content: require('./breakfastMenu.json')
        },
        burgers: {
            name: "Burger Menu",
            content: require('./burgersMenu.json')
        }
    },
    shoppingCart: {
        name: "Your Order",
        content: require('./shoppingCartCard.json')
    },
}