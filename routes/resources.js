"use strict";

const scraper = require('../public/scripts/scraper.js');
const cheerio = require('cheerio');
// const db      = require('../db/queries.js');
const scraper_request = require('../public/scripts/scraper.js');

const express = require('express');
const router  = express.Router();

module.exports = (db) => {


  router.get("/", (req, res) => {
    // What does get /resources do? Anything?
  })

  router.post("/new/choice", (req, res) => {
    console.log('new/choice');
    console.log('req query', req.query);
    const sources = req.query['sources'];
    console.log('sources', sources);
    req.session.templateVars = {sources: sources};
    res.redirect("/resources/wenew/we");
  })


  router.post("/new", (req, res) => {
    const url = req.body.url;
    console.log('resources/new');
    console.log('url', url);

    scraper(url, function(body){

      const $ = cheerio.load(body);
      // console.log('body appears to be', body);
      // console.log("$ appears to be", $);
      // console.log('imgs', $('img'));

      const imgs = $('img');
      console.log('imgs', imgs);

      let sources = [];
      for (let img in imgs) {
        if (imgs[img].hasOwnProperty('attribs')) {
          if (imgs[img].attribs.src) {
            console.log('one image is', imgs[img]);
            sources.push(imgs[img].attribs.src);
          }
        }
      }

      req.templateVars.sources = sources;
      console.log('in scraper callback');
      res.render("new_choice", req.templateVars);
    })
  })

  router.get("/search", (req, res) => {
    let searchTerm = req.query.search;
    db.getResourcesBySearch(searchTerm, function(resources) {
      res.json(resources);
    })
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

  // router.get("/:resource_id", (req, res) => {
  //   resource_id = req.params.resource_id;
  //   db.getResource(req.params.resource_id, function(resource) {
  //     res.render('show', resource);
  //   })

  // });

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
