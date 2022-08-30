const fs = require('fs');
const formidable = require('formidable');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;

const mongoUrl = process.env.MONGODB_URL;
// const nodemailer = require('nodemailer');

exports.main = (req, res) => {
  res.render('01_main.ejs', null);
};

exports.aboutme = (req, res) => {
  res.render('02_aboutme.ejs', null);
};


exports.contact = (req, res) => {
  res.render('03_contact.ejs', null);
};

exports.contactSubmit = (req, res) => {
  let mongodat = {
    name: req.body.contactname,
    mail: req.body.contactmail,
    date: req.body.contactdate,
    company: req.body.contactcompany,
    message: req.body.contactmessage
  };

  MongoClient.connect(mongoUrl, { useUnifiedTopology: true }, function(err, db) {
    if (err) throw err;
    let dbo = db.db('introduction-site');

    dbo.collection('contact-mails').insertOne(mongodat, function(err, result) {
      if (err) throw err;
      res.send("Message sent successfully");
      db.close();
    });
  });
};

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
      res.render('40-mongotest.ejs', mongodat);
    });
  });
};