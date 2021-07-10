import { RequestError } from "@line/bot-sdk";
import { PrismaClient } from "@prisma/client";
import { response } from "express";
var express = require("express");
var Shopify = require('shopify-api-node');
var Line = require('@line/bot-sdk');

var router = express.Router();
var prisma = new PrismaClient();

const shopify = new Shopify({
    shopName: process.env.SHOPIFY_API_URL,
    apiKey: process.env.SHOPIFY_API_KEY,
    password: process.env.SHOPIFY_ACCESS_TOKEN
});

const client = new Line.Client({
    channelAccessToken: process.env.LINE_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET
});

router.get(`/collection`, async (req, res) => {
    await shopify.collectionListing.list({
        limit: 30,
        fields: ["handle"]
    }).then(data => {
        res.send({ success: true, collections: data });
    })
});

router.get(`/lineId`, async (req, res) => {
    const result = await prisma.shopifyUserLineUserRelation.findMany();
    res.send(result);
})

router.post(`/sendMessage`, async (req, res) => {
    var content = req.body.content;
    var lineIdArry = req.body.lineIdArry;
    var status = 200;
    if (content.length == 0) {
        status = 404;
        response.message = "通知內容為必填！";
    } else if (lineIdArry.length == 0) {
        status = 404;
        response.message = "沒有可發送的客戶！";
    } else {
        client.multicast(lineIdArry, { type: "text", text: content })
            .then(() => {
                response.message = "發送成功，共發送了" + lineIdArry.length + "則通知！";
            })
            .catch((err) => {
                if (err instanceof Line.RequestError || err instanceof Line.HTTPError) {
                    res.status(err.statusCode).json(err.message);
                }
            });
    };
    res.status(status).json(response);
})
module.exports = router;
