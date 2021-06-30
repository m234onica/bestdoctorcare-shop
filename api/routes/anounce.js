import { PrismaClient } from "@prisma/client";
var express = require("express");

var router = express.Router();
var prisma = new PrismaClient();

router.get(`/announcements`, async (req, res) => {
    var listCount = 10;
    var start = (req.query.page - 1) * listCount;
    const response = {};
    const result = await prisma.announcement.findMany({
        skip: start,
        take: listCount,
        where: {
            deletedAt: null
        }
    });

    var totalPages = 0;
    const announcementCount = await prisma.announcement.count({
        where: {
            deletedAt: null
        }
    });
    response.list = result;
    response.page = req.query.page;

    if (announcementCount % 10 == 0) {
        totalPages = parseInt(announcementCount / 10);
    } else {
        totalPages = parseInt(announcementCount / 10) + 1;
    }
    response.totalPages = totalPages;
    res.json(response);
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
            title: req.body.data.title,
            content: req.body.data.content,
            updatedAt: new Date()
        }
    });
    res.json(result);
})

router.post(`/announce/delete/:id`, async (req, res) => {
    const { id } = req.params;
    const result = await prisma.announcement.update({
        where: {
            id: Number(id),
        },
        data: {
            updatedAt: new Date(),
            deletedAt: new Date()
        }
    });
    res.json(result);
})

module.exports = router;
