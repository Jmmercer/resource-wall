"use strict";

const queries = require('../db/queries.js');

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.post("/", (req, res) => {
    req.session = null;
    res.redirect("/");
  });

  return router;
}
