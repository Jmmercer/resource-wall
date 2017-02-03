"use strict";

const db      = require('../db/queries.js');
const scraper_request = require('../public/scripts/scraper.js');

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {


  router.get("/", (req, res) => {
    // What does get /resources do? Anything?
  })

  router.get("/new/", (req, res) => {
    // Show 'new resource' page, including all images from webpage for selection
    // use scraper.js to get html from url, then send it back

    const url = req.query.new_url;
    console.log('url', url);
    scraper_request(url, function(body){;
    console.log('body', body);
    //res.html = body;
    res.send(body);
    })
  })

  router.get("/search", (req, res) => {
    // Takes search term, filters resources. Does not leave page.
    // knex select query here
    // ajax request for new resources
  })

  router.post("/", (req, res) => {
    //Create new resource

    const user_id = req.session_id;
    const title = req.body.title;
    const description = req.body.description;
    const url = req.body.url;
    const resource = {user_id:      user_id,
                      url:          url,
                      title:        title,
                      description:  description,
                    }
    db.saveResource(resource, function(resource){
    });
    res.redirect("/");
  })

  router.get("/:resource_id", (req, res) => {
    resource_id = req.params.resource_id;
    db.getResource(req.params.resource_id, function(resource) {
      res.render('show', resource);
    })

  });

  router.get("/:resource_id/likes", (req, res) => {
    // returns number of likes for that resource
  })

  router.get("/:resource_id/comments", (req, res) => {
    // returns number and content of comments for that resource
  })

  router.get("/:resource_id/ratings", (req, res) => {
    // returns ratings and average rating for that resource
  })

  return router;
}
