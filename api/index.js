// index.js
import express from "express"
import { PrismaClient } from "@prisma/client"
import bodyParser from "body-parser";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var announce = require("./routes/anounce");
var discount = require("./routes/discount");
app.use("/", announce);
app.use("/", discount);

module.exports = app;
