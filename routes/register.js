"use strict";

const queries = require('../db/queries.js');

const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcrypt');
const shortid = require('shortid');

module.exports = (knex) => {

  router.post("/", (req,res) => {
    //register new user
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const user_id = shortid.generate();

    req.session.user_id = user_id
    queries.saveUser({name: name, email: email, password: password}, function (user) {
      res.session_id = user.id;
    });

    res.redirect('/');

  })

  return router;
}
