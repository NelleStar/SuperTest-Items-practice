const express = require('express');
const router = new express.Router();
const ExpressError = require("../expressError");
const items = require("../fakeDB");
const { route } = require('../app');

// get request to /items that sends a json result with items array
router.get("/", function(req, res) {
    res.json({items});
});

// post request to /items which takes data from the body and pushes it onto the items array and sends a created status 201 and json back with the new item that was made
router.post("/", function(req, res, next) {
    try {
        if(!req.body.name) throw new ExpressError("Name is required", 400);
        const newItem = {
            name: req.body.name,
            price: req.body.price,
        };
        items.push(newItem);
        return res.status(201).json({ item: newItem});
    } catch(e) {
        return next(e);
    };
});

// get /items/name to find an item using the name and if we dont we throw an error otherwise we response with json for that item
router.get("/:name", function(req, res) {
    const foundItem = items.find( item => item.name === req.params.name);
    if(foundItem === undefined) {
        throw new ExpressError("Item not found!", 404);
    }
    res.json({ item: foundItem })
});

// patch req to items/name to update an item
router.patch("/:name", function(req, res){
    const foundItem = items.find(item => item.name === req.params.name);
    if(foundItem === undefined) {
        throw new ExpressError("Item not found!", 404);
    };
    foundItem.name = req.body.name;
    foundItem.price = req.body.price;
    res.json({ item: foundItem });
});

// delete specific items/name
router.delete("/:name", function (req, res) {
  const foundItemIndex = items.findIndex(
    (item) => item.name === req.params.name
  );
  if (foundItemIndex === -1) {
    throw new ExpressError("Item not found", 404);
  }
  items.splice(foundItemIndex, 1);
  res.json({ message: "Deleted" });
});


module.exports = router;