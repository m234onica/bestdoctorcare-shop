// index.js
import express from 'express'
import { PrismaClient } from '@prisma/client'
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient()
const app = express()

app.use(express.json())


/**
* logic for our api will go here
*/
export default {
    path: '/api',
    handler: app
}

app.get(`/discounts`, async (req, res) => {
    const result = await prisma.discount.findMany({
        where: {
            NOT: { draftOrderId: null }
        }
    })
    res.json(result)
})

