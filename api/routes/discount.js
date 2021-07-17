import { PrismaClient } from "@prisma/client";
var express = require("express");
var Shopify = require("shopify-api-node");
var { AsyncParser } = require("json2csv");
var fs = require("fs");

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

router.post("/export", async (req, res) => {
    const result = await prisma.discount.findMany({
        select: {
            userId: true,
            title: true,
            description: true,
            code: true,
            value: true
        }
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
        if (item.usedAt != null) {
            item.status = "已使用";
        } else {
            item.status = "尚未使用";
        }
    });

    const fields = ["userId", "title", "description", "code", "value", "customerName", "status"];
    const opts = { fields };
    const transformOpts = { highWaterMark: 8192 };

    const asyncParser = new AsyncParser(opts, transformOpts);

    let csv = "";
    asyncParser.processor
        .on("data", chunk => (csv += chunk.toString()))
        .on("end", () => {
            fs.writeFile('export.csv', csv, function (err) {
                if (err) throw err;
            });
            res.send(csv);
        })
        .on("error", err => console.error(err));

    asyncParser.input.push(JSON.stringify(result));
    asyncParser.input.push(null);
})

module.exports = router;
