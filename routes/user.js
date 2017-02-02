"use strict";

const db = require('./db');

const express = require('express');
const router  = express.Router();

module.exports = () => {

  router.get("/user", (req, res) => {
    db.getResources((results) => {
        res.json(results);
    });
  });

  return router;
}