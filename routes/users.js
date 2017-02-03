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
    const user_id = req.params.user_id;

    db.getResourcesByUser(user_id, function (resources) {
      const templateVars = {resources: resources,
                            user_id: user_id}
      res.render('user', resources);
    })

  });


  return router;
}