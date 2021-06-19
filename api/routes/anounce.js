import { PrismaClient } from "@prisma/client";
var express = require("express");

var router = express.Router();
var prisma = new PrismaClient();

router.get(`/announcements`, async (req, res) => {
    const result = await prisma.announcement.findMany({});
    res.json(result);
})

router.post(`/announce`, async (req, res) => {
    const result = await prisma.announcement.create({
        data: {
            title: req.body.data.title,
            content: req.body.data.content,
            updatedAt: new Date()
        }
    })
    res.status(200).json(result);
})

router.post(`/announce/:id`, async (req, res) => {
    const { id } = req.params;
    const result = await prisma.announcement.update({
        where: {
            id: Number(id),
        },
        data: {
            title: req.body.data.post.title,
            content: req.body.data.post.content,
            updatedAt: new Date()
        }
    });
    res.json(result);
})

module.exports = router;
