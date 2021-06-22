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
    const totalPages = await prisma.discount.count();
    response.list = result;
    response.page = req.query.page;
    response.totalPages = parseInt(totalPages / 10) + 1;
    res.json(response);
})

module.exports = router;
