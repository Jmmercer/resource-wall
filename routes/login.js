"use strict";

const db = require('../db/queries.js');

const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcrypt');
const shortid = require('shortid')


module.exports = (knex) => {

  router.post("/", (req, res) => {


  })

  return router;
}
