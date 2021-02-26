const { request, response } = require("express");
const express = require("express");
const cart = express.Router();
const pool = require('./pg-connection-pool');

// Add array
// const cartItems = [
//     {id: 1, product: "Cookies", price: 15, quantity: 12},
//     {id: 2, product: "Brownies", price: 12, quantity: 4},
//     {id: 3, product: "Donuts", price: 7, quantity: 6},
//     {id: 4, product: "Cupcakes", price: 16, quantity: 8},
// ]

cart.get("/cart-items", (req, res) => {
  let items = [];  
  
  pool.query("SELECT * FROM shopping_cart;").then( (results) => {
    items = results.rows  
    console.log(items);
    // res.json(results.rows);
  

  let filteredItems = items
  if (req.query) {
     if (req.query.maxPrice) {
         filteredItems = filteredItems.filter(
             (filteredItems) => filteredItems.price < parseFloat(req.query.maxPrice)
         );
     }
     if (req.query.prefix) {
         filteredItems = filteredItems.filter((filteredItems) =>
         filteredItems.product.startsWith(req.query.prefix)
         );
     }
     if (req.query.pageSize) {
         filteredItems = filteredItems.slice(0, parseInt(req.query.pageSize));
     }
    //  res.status(200).send(filteredItems);
  }

res.json(filteredItems);
})

})

cart.get("/cart-items/:id", (req, res) => {
  const id = req.params.id;
  pool.query("SELECT * FROM shopping_cart WHERE id=$1", [id]).then ((results) => {
    const items = results.rows;
        if (!items.length) {
            res.status(404).json('Not found');
        } else {
            res.json(items);
        }
    })
  });
  
cart.post("/cart-items", (req, res) => {
  const newItem = req.body;
	// Add to array
	// routes.push(newPlanet);
	pool.query('INSERT INTO shopping_cart (product, price, quantity) VALUES ($1, $2, $3);', [
		newItem.product,
		newItem.price,
    newItem.quantity
	]).then( () => {
        res.status(201); // return 201 status code
        res.json(newItem);
    })
});

cart.put("/cart-items/:id", (req, res) => {
  const id = req.params.id;
  const item=req.body;
  console.log(req.body);
  pool.query('UPDATE shopping_cart SET product=$1, price=$2, quantity=$3 WHERE id=$4 RETURNING *;' , 
  [
		item.product,
    item.price,
		item.quantity,
    id
	]).then( (results) => {
        res.status(201); // return 201 status code
        res.json(results.rows);
    })
});

cart.delete("/cart-items/:id", (req, res) => {
  const id = req.params.id;
    pool.query("DELETE FROM shopping_cart WHERE id=$1", [id]).then( () => {
        res.status(204);
        res.json("Deleted")
    })
});

module.exports = cart; 