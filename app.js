const dotenv = require("dotenv");
dotenv.config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var passport = require("passport");
var bodyParser = require("body-parser");
var cors = require("cors");
var LocalStrategy = require("passport-local").Strategy;

require("./models/post");

var indexRouter = require("./routes/index");
const userRouter = require("./routes/user");
const blogRouter = require("./routes/blog");
const postRouter = require("./routes/post");

const mongoose = require("mongoose");
const url = process.env.DB_HOST;
const connect = mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connect.then(
  (db) => {
    console.log("hello");
  },
  (err) => {
    console.log(err);
  },
);

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

var originsWhiteList = [
  "http://localhost:4200",
  "http://localhost:3000",
  "https://localhost:3443",
  "https://ec2-3-87-212-53.compute-1.amazonaws.com:3000",
  "3.87.212.53/24",
  "3.87.212.53:3000",
  "http://3.87.212.53",
];

var corsOptions = {
  origin: function (origin, callback) {
    var isWhitelisted = originsWhiteList.indexOf(origin) !== -1;
    callback(null, isWhitelisted);
  },
  credentials: true,
};
app.use(cors(corsOptions));

app.use(passport.initialize());

app.use("/", indexRouter);
app.use("/api/user", userRouter);
app.use("/api/blog", blogRouter);
app.use("/api/post", postRouter);

app.disable("etag");

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
