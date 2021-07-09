import { PrismaClient } from "@prisma/client";
var express = require("express");
var Shopify = require('shopify-api-node');

var router = express.Router();
var prisma = new PrismaClient();
var shopify = new Shopify({
    shopName: process.env.SHOPIFY_API_URL,
    apiKey: process.env.SHOPIFY_API_KEY,
    password: process.env.SHOPIFY_ACCESS_TOKEN
});

router.get(`/collection`, async (req, res) => {
    const collectionFields = ["handle"].join(',');
    await shopify.collectionListing.list({
        limit: 30,
        fields: ["handle"]
    }).then(data => {
        res.send({ success: true, collections: data });
    })
});

module.exports = router;
