const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const UploadStream = require('s3-stream-upload');

const AWS = require('aws-sdk');
const s3 = new AWS.S3;

exports.main = (req, res) => {
	res.render('06_fileuploader-awstest.ejs', null);
};

exports.ex01upload = (req, res) => {
  const form = formidable({ multiples: true });
  const awsFolder = 'about-me/aws-test/';


  form.parse(req, (err, fields, files) => {
    if (err) console.log('form.parse err', err);
    console.log('form.parse files', files);
  });

  form.on('file', (formname, file) => {
    console.log('form.on file.filepath', file.filepath);
    console.log('form.on file.originalFilename', file.originalFilename);

    let awsKey = awsFolder + file.originalFilename;

    fs.readFile(file.filepath, (err, data) => {
      let awsParams = {
        Bucket: process.env.AWS_BUCKET,
        Key: awsKey,
        Body: data
      };

      s3.upload(awsParams, (err, data) => {
        if(err) {
          console.log(err);
          res.status(err.statusCode).send("Upload was not successful: " + err.code);
        } else {
          console.log(awsKey + " uploaded successfully");         
        }
      });
    });
  })

  form.once('end', () => {
    res.send("done");
    console.log('Done!');
  });
};

exports.ex02upload = (req, res) => {
  const form = formidable({ multiples: true });
  const awsFolder = 'about-me/aws-test/';

  form.parse(req, (err, fields, files) => {
    if (err) console.log('form.parse err', err);
    console.log('form.parse files', files);
  });

  form.on('file', (formname, file) => {
    console.log('form.on file.filepath', file.filepath);
    console.log('form.on file.originalFilename', file.originalFilename);

    let awsKey = awsFolder + file.originalFilename;
    let dataStream = fs.createReadStream(file.filepath);    
    let awsParams = {
      Bucket: process.env.AWS_BUCKET,
      Key: awsKey,
      Body: dataStream
    };

    s3.upload(awsParams, (err, data) => {
      if(err) {
        console.log(err);
        res.status(err.statusCode).send("Upload was not successful: " + err.code);
      } else {
        console.log(awsKey + " uploaded successfully");         
      }
    });
  });

  form.once('end', () => {
    res.send("done");
    console.log('Done!');
  });
};

exports.ex03upload = (req, res) => {
  const form = formidable({ multiples: true });
  const awsFolder = 'about-me/aws-test/';

  form.parse(req, (err, fields, files) => {
    if (err) console.log('form.parse err', err);
    console.log('form.parse files', files);
  });

  form.on('file', (formname, file) => {
    console.log('form.on file.filepath', file.filepath);
    console.log('form.on file.originalFilename', file.originalFilename);

    let awsKey = awsFolder + file.originalFilename;
    let dataStream = fs.createReadStream(file.filepath);    
    let awsParams = {
      Bucket: process.env.AWS_BUCKET,
      Key: awsKey
    };

    dataStream.pipe(UploadStream(s3, awsParams));
    dataStream.on('error', (err) => console.log(err));
    dataStream.on('close', () => {
      console.log(`${awsKey} uploaded to the bucket.`);
    });
  });

  form.once('end', () => {
    res.send("done");
    console.log('Done!');
  });
};

