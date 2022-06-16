const fs = require('fs');
const formidable = require('formidable');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const mongoUrl = "mongodb+srv://st:gSaCRgRWC4niM4fd@introduction-site.8s83u.mongodb.net/?retryWrites=true&w=majority";

exports.main = (req, res) => {
  res.render('01-main.ejs', null);
};

exports.aboutme = (req, res) => {
  res.render('02-aboutme.ejs', null);
};

exports.snake = (req, res) => {
  res.render('02-snake.ejs', null);
};

exports.contact = (req, res) => {
  res.render('06-contact.ejs', null);
}

exports.mongotest = (req, res) => {
  let mongodat = {};
  mongodat.data = "This is hardcoded in app.js. If everything goes fine, something from a mongodb should be here";

  MongoClient.connect(mongoUrl, { useUnifiedTopology: true }, function(err, db) {
    if (err) throw err;
    let dbo = db.db("introduction-site");
  
    dbo.collection("test").find({}).toArray(function(err, result) {
      if (err) throw err;
      mongodat.data = result[0].message;
      db.close();
      res.render('03-mongotest.ejs', mongodat);
    });
  });
};