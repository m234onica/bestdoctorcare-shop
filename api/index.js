var express = require("express");
var bodyParser = require("body-parser");

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var announce = require("./routes/anounce");
var discount = require("./routes/discount");
app.use("/", announce);
app.use("/", discount);

module.exports = app;
