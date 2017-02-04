"use strict";



const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcrypt');
const shortid = require('shortid');

module.exports = (knex) => {
  const db = require('../db/queries.js')(knex);

  router.post("/", (req,res) => {

    //register new user
    console.log(req.body.password)
    const password_hash = bcrypt.hashSync(req.body.password, 10);
    const new_user = {name:     req.body.name,
                      email:    req.body.email,
                      password: password_hash};

    db.getUserByEmail(new_user.email, (user) => {

      if (user) {

        console.log('User already exists');
        req.session.error_message = 'User already exists';
        res.status(405).redirect('/');
        return;

      } else {

        db.saveUser(new_user, function (user) {
          req.session_id = user.id;
          res.redirect('/');
        });
      }
    })
  })

  return router;
}
