"use strict";



const express = require('express');
const router  = express.Router();

module.exports = (knex) => {
  const db = require('../db/queries.js')(knex);

  router.get("/", (req, res) => {
    // What does get /users do? Anything?
  });

  router.get("/:user_id", (req, res) => {
    // Show user page
    const user = {id: req.params.user_id}

    db.getResourcesByUser(user.id, function (resources) {

      const templateVars = {resources: resources,
                            user: user}

      res.render('user', templateVars);
    })

  });


  return router;
}