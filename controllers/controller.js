// Node Dependencies
var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request'); // for web-scraping
var cheerio = require('cheerio'); // for web-scraping

var Comment = require('../models/Comment.js');
var Article = require('../models/Article.js');

router.get('/', function (req, res){


  res.redirect('/scrape');

});



router.get('/articles', function (req, res){


  Article.find().sort({_id: -1})


    .populate('comments')


    .exec(function(err, doc){
      // log any errors
      if (err){
        console.log(err);
      }

      else {
        var hbsObject = {articles: doc}
        res.render('index', hbsObject);

      }
    });

});



router.get('/scrape', function(req, res) {

  request('https://news.ycombinator.com/', function(error, response, html) {


    var $ = cheerio.load(html);


    var titlesArray = [];

    $('.title').each(function(i, element) {

        var result = {};

        result.title = $(this).children('a').text(); //convert to string for error handling later

        // Collect the Article Link (contained within the "a" tag of the "h2" in the "header" of "this")
        result.link = $(this).children('a').attr('href');


        if(result.title !== ""){

          if(titlesArray.indexOf(result.title) == -1){

            titlesArray.push(result.title);
e
            Article.count({ title: result.title}, function (err, test){

              if(test == 0){

                var entry = new Article (result);

                // Save the entry to MongoDB
                entry.save(function(err, doc) {
                  // log any errors
                  if (err) {
                    console.log(err);
                  }
                  // or log the doc that was saved to the DB
                  else {
                    console.log(doc);
                  }
                });

              }

              else{
                console.log('Redundant Database Content. Not saved to DB.')
              }

            });
        }

        else{
          console.log('Redundant Hacker News Content. Not Saved to DB.')
        }

      }

      else{
        console.log('Empty Content. Not Saved to DB.')
      }

    });


    res.redirect("/articles");

  });

});



router.post('/add/comment/:id', function (req, res){


  var articleId = req.params.id;

  var commentAuthor = req.body.name;

  var commentContent = req.body.comment;

  var result = {
    author: commentAuthor,
    content: commentContent
  };

  var entry = new Comment (result);

  entry.save(function(err, doc) {
    // log any errors
    if (err) {
      console.log(err);
    }
    // Or, relate the comment to the article
    else {

      Article.findOneAndUpdate({'_id': articleId}, {$push: {'comments':doc._id}}, {new: true})

      .exec(function(err, doc){

        if (err){
          console.log(err);
        } else {

          res.sendStatus(200);
        }
      });
    }
  });

});




// Delete a Comment Route
router.post('/remove/comment/:id', function (req, res){

  // Collect comment id
  var commentId = req.params.id;

  // Find and Delete the Comment using the Id
  Comment.findByIdAndRemove(commentId, function (err, todo) {

    if (err) {
      console.log(err);
    }
    else {
      // Send Success Header
      res.sendStatus(200);
    }

  });

});


// Export Router to Server.js
module.exports = router;
