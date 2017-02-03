"use strict";

const db = require('../db/queries.js');

const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcrypt');
const shortid = require('shortid')


module.exports = function (knex) {

  router.post("/", (req, res) => {
    //login
  })

  router.get("/", (req, res) => {
    res.render("login_test");
  });

  return router;
}