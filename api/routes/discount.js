import { PrismaClient } from "@prisma/client";
var express = require("express");

var router = express.Router();
var prisma = new PrismaClient();

router.get(`/discounts`, async (req, res) => {
    const result = await prisma.discount.findMany({});
    res.json(result);
})

module.exports = router;
