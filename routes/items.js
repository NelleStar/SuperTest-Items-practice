const express = require('express');
const router = new express.Router();
const ExpressError = require("../expressError");
const items = require("../fakeDB");

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
        }
        items.push(newItem);
        return res.status(201).json({ item: newItem});
    } catch(e) {
        return next(e)
    }
})