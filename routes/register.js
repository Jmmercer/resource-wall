"use strict";

const queries = require('../db/queries.js');

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.post("/", (req,res) => {
    //register new user
    const name = req.body.name;
    const email = req.body.email;
  })

  return router;
}
