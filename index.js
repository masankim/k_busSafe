var express = require("express");
var app = express();
var path = require("path");
var session = require("express-session");
var moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asia/Seoul");
require("ejs")
var apiRouter = require('./routes/router')

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "eewrwerwe",
    resave: false,
    saveUninitialized: true,
  })
);

app.use('/', apiRouter);


var port = 8080;
app.listen(port, function () {
  var check_time = moment().format("YYYYMMDDHHmmss");
  console.log(check_time);
  console.log("웹 서버 시작", port);
});