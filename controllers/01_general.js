const fs = require('fs');
const formidable = require('formidable');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;

const mongoUrl = process.env.MONGODB_URL;

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