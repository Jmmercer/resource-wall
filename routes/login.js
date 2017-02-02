"use strict";

const queries = require('../db/queries.js');

const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcrypt-nodejs');
const shortid = require('shortid')


module.exports = (knex) => {

  router.post("/", (req, res) => {
    //knex request for email, password
  })

  return router;
}
