// index.js
import express from 'express'
import { PrismaClient } from '@prisma/client'
import bodyParser from "body-parser";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get(`/posts`, async (req, res) => {
    const result = await prisma.announcement.findMany({});
    res.json(result);
})

app.post(`/announce/post`, async (req, res) => {
    const result = await prisma.announcement.create({
        data: {
            title: req.body.data.title,
            content: req.body.data.content
        }
    })
    res.status(200).json(result);
})

app.get(`/discounts`, async (req, res) => {
    const result = await prisma.discount.findMany({});
    res.json(result);
})

module.exports = app;
