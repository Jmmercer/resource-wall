"use strict";

const db = require('../db/queries.js');

const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcrypt');
const shortid = require('shortid');

module.exports = (knex) => {

  router.post("/", (req,res) => {
    //register new user

    const password_hash = bcrypt.hashSync(req.body.password, 10);
    const new_user = {name:     req.body.name,
                      email:    req.body.email,
                      password: password_hash};

    db.saveUser(new_user, function (user) {
      req.session_id = user.id;
    });

    res.redirect('/');

  })

  return router;
}
