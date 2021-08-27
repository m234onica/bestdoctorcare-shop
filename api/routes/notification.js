import { RequestError } from "@line/bot-sdk";
import { PrismaClient } from "@prisma/client";
import { response } from "express";
var express = require("express");
var Shopify = require('shopify-api-node');
var Line = require('@line/bot-sdk');
var moment = require('moment');
var axios = require("axios");

var router = express.Router();
var prisma = new PrismaClient();

const shopifyName = process.env.SHOPIFY_API_URL,
    shopifyApiKey = process.env.SHOPIFY_API_KEY,
    shopifyPassword = process.env.SHOPIFY_ACCESS_TOKEN,
    lineAccessToken = process.env.LINE_ACCESS_TOKEN,
    lineChannelSecret = process.env.LINE_CHANNEL_SECRET;

const shopify = new Shopify({
    shopName: shopifyName,
    apiKey: shopifyApiKey,
    password: shopifyPassword
});

const client = new Line.Client({
    channelAccessToken: lineAccessToken,
    channelSecret: lineChannelSecret
});

router.get(`/collection`, async (req, res) => {
    await shopify.collectionListing.list({
        limit: 30,
        fields: ["id", "title"]
    }).then(data => {
        res.send({ success: true, collections: data });
    })
});

router.get(`/lineId`, async (req, res) => {
    var type = req.query.type;
    var collection = req.query.collection;

    if (type == "ALL") {
        var result = await prisma.shopifyUserLineUserRelation.findMany({});
    } else {
        var dateRaw = ``;
        var collectionRaw = ``;

        if (req.query.dateRange.length != 0) {
            var dateRange = req.query.dateRange.split(',');
            var start = dateRange[0];
            var end = moment(dateRange[1]).add(1, "day").format("YYYY-MM-DD");

            dateRaw = `AND (createdAt BETWEEN "${start}" AND "${end}")`;
        }

        if (collection != "全部") {
            var url = `https://${shopifyApiKey}:${shopifyPassword}@${shopifyName}/admin/api/2021-04/collections/${collection}/products.json`;
            var data = await axios.get(url);
            var products = data.data.products;
            var arryProductId = [];

            products.forEach(product => {
                arryProductId.push(product.id);
            });

            var collectionRaw = `AND productId in (${arryProductId.join()})`;
        }

        const raw = `SELECT * FROM ShopifyUserLineUserRelation WHERE shopifyUserId IN (
                        SELECT userId FROM EventLog
                            WHERE type="${type}" ${dateRaw} ${collectionRaw} );`;

        var result = await prisma.$queryRaw(raw);
    }
    res.send(result);
})

router.post(`/sendMessage`, async (req, res) => {
    var content = req.body.content;
    var lineIdArry = req.body.lineIdArry;
    var response = {};
    var status = 200;

    if (content.length == 0) {
        status = 404;
        response.message = "通知內容為必填！";
        res.status(status).json(response);

    } else if (lineIdArry.length == 0) {
        status = 404;
        response.message = "沒有可發送的客戶！";
        res.status(status).json(response);

    } else {
        client.multicast(lineIdArry, { type: "text", text: content })
            .then(() => {
                response.message = "發送成功，共發送了" + lineIdArry.length + "則通知！";
                res.status(status).json(response);
            })
            .catch((err) => {
                status = 404;
                response.message = "系統出現問題，重整後再試。"
                res.status(status).json(response);
            });
    };
})
module.exports = router;
