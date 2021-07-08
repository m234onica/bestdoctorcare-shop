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

router.get(`/discounts`, async (req, res) => {
    var listCount = 10;
    var start = (req.query.page - 1) * listCount;
    const response = {};
    const result = await prisma.discount.findMany({
        skip: start,
        take: listCount
    });

    const customerFields = ["id", "first_name"].join(',');
    const customers = await shopify.customer.list({
        fields: customerFields
    });

    result.forEach((item) => {
        customers.forEach((customer) => {
            var userId = item.userId;
            if (customer.id == userId) {
                item.customerName = customer.first_name;
            }
        });
    });


    var totalPages = 0;
    const discountCount = await prisma.discount.count();
    response.list = result;
    response.page = req.query.page;
    if (discountCount % 10 == 0) {
        totalPages = parseInt(discountCount / 10);
    } else {
        totalPages = parseInt(discountCount / 10) + 1;
    }
    response.totalPages = totalPages;
    res.json(response);
})

module.exports = router;
