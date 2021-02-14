const { request, response } = require("express");
const express = require("express");
const cart = express.Router();

// Add array
const cartItems = [
    {id: 1, product: "Cookies", price: 15, quantity: 12},
    {id: 2, product: "Brownies", price: 12, quantity: 4},
    {id: 3, product: "Donuts", price: 7, quantity: 6},
    {id: 4, product: "Cupcakes", price: 16, quantity: 8},
]

cart.get("/cart-items", (request, response) => {
// res.status(200)
//  res.json(cartItems);

 let filteredItems = cartItems;
 if (request.query) {
    if (request.query.maxPrice) {
        filteredItems = cartItems.filter(
            (cartItems) => cartItems.price < parseFloat(request.query.maxPrice)
        );
    }
    if (request.query.prefix) {
        filteredItems = cartItems.filter((i) =>
        i.product.startsWith(request.query.prefix)
        );
    }
    if (request.query.pageSize) {
        filteredItems = cartItems.slice(0, parseInt(request.query.pageSize));
    }
    response.status(200).send(filteredItems);
 }
});

cart.get("/cart-items/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const item = cartItems.find(cartItem => {
        return cartItem.id === id;
    });

    if (item) {
        res.json(item);
    } else {
        res.status(404);
        res.json('ID Not Found');
    }
});

cart.post("/cart-items", (req, res) => {
    const cartItem = {
        id: cartItems.length +1,
        product: req.body.product,
        price: parseInt(req.body.price),
        quantity: parseInt(req.body.quantity)
    };
    cartItems.push(cartItem);
    res.status(201);
    res.json(cartItem);
});

cart.put("/cart-items/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = cartItems.findIndex(item => item.id === id);
    const cartItem = {
        id: id,
        product: req.body.product,
        price: parseInt(req.body.price),
        quantity: parseInt(req.body.quantity)
    };
    cartItems.splice(index, 1, cartItem)
    res.status(200);
    res.json(cartItem);
});

cart.delete("/cart-items/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = cartItems.findIndex(item => item.id === id);
    console.log(index);
    cartItems.splice(index, 1)
    res.status(204);
    res.json();
});

module.exports = cart; 