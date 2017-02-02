"use strict";

require('dotenv').config();

const PORT          = process.env.PORT || 8080;
const ENV           = process.env.ENV || "development";
const express       = require("express");
const bodyParser    = require("body-parser");
const sass          = require("node-sass-middleware");
const app           = express();

const knexConfig    = require("./knexfile");
const knex          = require("knex")(knexConfig[ENV]);
const morgan        = require('morgan');
const knexLogger    = require('knex-logger');
const cookieSession = require('cookie-session');

// Query functions object with knex injection
const db = require('./db/queries')(knex);
// Testing db - to remove
// console.log(db.getResource(1));
// console.log(db.getAllResources());
// console.log(db.getResourcesByUser(2));
// console.log(db.getResourcesByCategory(1));
// console.log(db.getResourcesBySearch('ahoo'));
// console.log(db.getResourcesByUserLiked(3));
// console.log(db.getResourcesByUser(3));
// Seperated Routes for each Resource
const resources = require("./routes/resources")
const login = require("./routes/login")
const logout = require("./routes/logout")
const register = require("./routes/register")
const user = require("./routes/user")


// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
// The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Mount all resource routes
//app.use("/api/users", usersRoutes(knex));
app.use("/resources", resources);
app.use("/login", login);
app.use("/logout", logout);
app.use("/register", register);


// Home page
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/user", (req, res) => {
  res.render("user");
});

app.get("/resources/:id", (req, res) => {

  let templateVars = { resource_id: req.params.id
                     };
  res.render("show", templateVars);

});

app.get("/search", (req, res) => {
  $.ajax({
        method: "Get",
        url: "/search"
      }).done((resources) => {
        for (resource of resources) {
          $("<div>").html(pin.title).appendTo($("body"));
        }
      })
})

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
