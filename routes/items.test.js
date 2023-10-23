process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
let items = require("../fakeDB");

let reeses = {
    name: "Reese's Peanut Butter Cups",
    price: 1.75,
};

beforeEach(function() {
    items.push(reeses);
});

afterEach(function() {
    items.length = 0;
});

describe("GET /items", function() {
    test("Gets a list of items", async function() {
        const resp = await request(app).get('/items');
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({items: [reeses]});
    });
});
// end

describe("GET /items/:name", function() {
    test("Gets a single item", async function() {
        const resp = await request(app).get(`/items/${reeses.name}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({item:reeses});
    });
    test("Reponds with 404 if can't find item", async function() {
        const resp = await request(app).get(`/items/snickers`);
        expect(resp.statusCode).toBe(404);
    });
});
// end

describe("POST /items", function() {
    test("Creates a new item", async function() {
        const resp = await request(app)
            .post(`/items`)
            .send({
                name: "Hershey's Chocolate Bar", 
                price: 1.00
            });
        expect(resp.statusCode).toBe(201);
        expect(resp.body).toEqual({
            item: { name: "Hershey's Chocolate Bar", price: 1.00 }
        });
    });
    test("Reponds with 400 if name or price is missing", async function() {
        const resp = await request(app)
            .post(`/items`)
            .send({});
        expect(resp.statusCode).toBe(400);
    });
});
// end

describe("PATCH /items/:name", function() {
    test("Updates a single item", async function() {
        const resp = await request(app)
            .patch(`/items/${reeses.name}`)
            .send({
                name: "Snickers",
                price: 3.00
            });
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            item: {name: "Snickers", price: 3.00}
        });
    });
    test("Responds with 404 if is info invalid", async function() {
        const resp = await request(app).patch(`/items/0`);
        expect(resp.statusCode).toBe(404);
    });
});
// end

describe("DELETE /items/:name", function() {
    test("Deletes a single item", async function() {
        const resp = await request(app).delete(`/items/${reeses.name}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({ message: "Deleted" });
    });
    test("Responds with a 404 for deleting invalid item", async function() {
        const resp = await request(app).delete(`/items/snickers`);
        expect(resp.statusCode).toBe(404);
    });
});