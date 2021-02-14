// require the Express module
const express = require("express");
const cart = require('./cart');

// creates an instance of an Express server
const app = express();

app.use(express.json());

// const cartItems = [
//     {id: 1, product: "Cookies", price: 15, quantity: 12},
//     {id: 2, product: "Brownies", price: 12, quantity: 4},
//     {id: 3, product: "Donuts", price: 7, quantity: 6},
//     {id: 4, product: "Cupcakes", price: 16, quantity: 8},
// ]

// define the port
const port = 3000;

app.use("/", cart);
// run the server

app.listen(port, () => console.log(`Listening on port: ${port}.`));

console.log("http://localhost:" + port + "/cart-items");