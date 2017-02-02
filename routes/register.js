"use strict";

const queries = require('../db/queries.js');

const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcrypt-nodejs');
const shortid = require('shortid');

module.exports = (knex) => {

  router.post("/", (req,res) => {
    //register new user

    const name = req.body.name;
    const email = req.body.email;
    const user_id = shortid.generate();
    req.session.user_id = user_id
    //knex stuff here

  })

  return router;
}
