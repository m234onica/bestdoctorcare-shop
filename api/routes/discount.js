import { PrismaClient } from "@prisma/client";
var express = require("express");
var Shopify = require("shopify-api-node");
var { AsyncParser } = require("json2csv");
var fs = require("fs");
var moment = require("moment");

var router = express.Router();
var prisma = new PrismaClient();
var shopify = new Shopify({
    shopName: process.env.SHOPIFY_API_URL,
    apiKey: process.env.SHOPIFY_API_KEY,
    password: process.env.SHOPIFY_ACCESS_TOKEN
});

router.get(`/discounts`, async (req, res) => {
    var listCount = parseInt(process.env.LIST_COUNT);
    var start = (req.query.page - 1) * listCount;
    const response = {};
    const result = await prisma.discount.findMany({
        skip: start,
        take: listCount,
        orderBy: {
            createdAt: "desc"
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
    });


    var totalPages = 0;
    const discountCount = await prisma.discount.count();
    response.list = result;
    response.page = req.query.page;
    if (discountCount % 9 == 0) {
        totalPages = parseInt(discountCount / listCount);
    } else {
        totalPages = parseInt(discountCount / listCount) + 1;
    }
    response.totalPages = totalPages;
    res.json(response);
})

router.get("/export", async (req, res) => {
    const result = await prisma.$queryRaw(`
        SELECT * FROM Discount
        LEFT JOIN ShopifyUserLineUserRelation
        ON Discount.userId = ShopifyUserLineUserRelation.shopifyUserId
        ORDER BY createdAt DESC
        ;
    `);
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
            item.usedAt = moment(item.usedAt).format("YYYY-MM-DD HH:mm:ss");
        }
        item.createdAt = moment(item.createdAt).format("YYYY-MM-DD HH:m:s");
    });

    const fields = [
        {
            value: "customerName",
            label: "使用者"
        },
        {
            value: "userId",
            label: "Shopify ID"
        },
        {
            value: "lineUserId",
            label: "Line ID"
        },
        {
            value: "title",
            label: "發送因由"
        },
        {
            value: "code",
            label: "折扣碼"
        },
        {
            value: "value",
            label: "折扣金額"
        },
        {
            value: "usedAt",
            label: "使用時間"
        },
        {
            value: "createdAt",
            label: "建立時間"
        }
    ];
    const opts = { fields };
    const transformOpts = { highWaterMark: 8192 };

    const asyncParser = new AsyncParser(opts, transformOpts);

    let csv = "";
    asyncParser.processor
        .on("data", chunk => (csv += chunk.toString()))
        .on("end", () => res.send(csv))
        .on("error", err => console.error(err));

    asyncParser.input.push(JSON.stringify(result));
    asyncParser.input.push(null);
})

module.exports = router;
