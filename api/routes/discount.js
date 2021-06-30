import { PrismaClient } from "@prisma/client";
var express = require("express");

var router = express.Router();
var prisma = new PrismaClient();

router.get(`/discounts`, async (req, res) => {
    var listCount = 10;
    var start = (req.query.page - 1) * listCount;
    const response = {};
    const result = await prisma.discount.findMany({
        skip: start,
        take: listCount
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
