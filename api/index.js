// index.js
import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.get(`/discounts`, async (req, res) => {
    const result = await prisma.discount.findMany({});
    res.json(result);
})

module.exports = app;
