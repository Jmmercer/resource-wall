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

db.getResourcesBySearch('swahili');
db.getAllResources(console.log)

// Seperated Routes for each Resource
const resources = require("./routes/resources")
const login = require("./routes/login")
const logout = require("./routes/logout")
const register = require("./routes/register")
const users = require("./routes/users")


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
app.use("/resources", resources(knex));
app.use("/login", login(knex));
app.use("/logout", logout(knex));
app.use("/register", register(knex));
app.use("/users", users(knex));


// Home page
app.get("/", (req, res) => {
  if (req.session.error_message) {
  // TODO Have a container for the error message
  console.log('error:', req.session.error_message);
  }

  if (!req.session_id) {
    var templateVars = {placeholder: 0}; //knex request for user info
    db.getAllResources(function(resources) {

      // TODO Get user by req.session_id, display info on home page
      templateVars.resources = resources;
      res.render("index", templateVars);
    });
  } else {

    var templateVars = {placeholder: 0}; //no user info, revert to default
    res.render("index", templateVars);
  }
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
