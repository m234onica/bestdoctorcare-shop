var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var announce = require("./routes/anounce");
var discount = require("./routes/discount");
app.use("/", announce);
app.use("/", discount);

module.exports = app;
