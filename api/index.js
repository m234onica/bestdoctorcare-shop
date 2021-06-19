// index.js
import express from 'express'
import { PrismaClient } from '@prisma/client'
import bodyParser from "body-parser";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get(`/announcements`, async (req, res) => {
    const result = await prisma.announcement.findMany({});
    res.json(result);
})

app.post(`/announce`, async (req, res) => {
    const result = await prisma.announcement.create({
        data: {
            title: req.body.data.title,
            content: req.body.data.content
        }
    })
    res.status(200).json(result);
})

app.post(`/announce/:id`, async (req, res) => {
    const { id } = req.params;
    const result = await prisma.announcement.update({
        where: {
            id: Number(id),
        },
        data: {
            title: req.body.data.post.title,
            content: req.body.data.post.content
        }
    });
    res.json(result);
})

app.get(`/discounts`, async (req, res) => {
    const result = await prisma.discount.findMany({});
    res.json(result);
})

module.exports = app;
