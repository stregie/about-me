const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const UploadStream = require('s3-stream-upload');

const AWS = require('aws-sdk');
const s3 = new AWS.S3;

exports.main = (req, res) => {
	res.render('06_fileuploader-awstest.ejs', null);
};

exports.objectList = (req, res) => {
  const awsFolder = 'about-me/aws-test/';

  const awsParams = {
    Bucket: process.env.AWS_BUCKET
  };

  s3.listObjects(awsParams, (err, data) => {
    if(err) {
      res.status(err.statusCode).send("Download unsuccessful: " + err.code);
    } else {
      const objectList = data.Contents.filter((file) => {
        return file.Key.match(awsFolder) !== null
      }).map((file) => {
        return {
          Key: file.Key,
          Name: file.Key.slice(awsFolder.length),
          Size: file.Size
        }
      });
      // console.log(fileList);
      res.json(objectList);
    }
  });
};

exports.delete = (req, res) => {
  const fileName = req.query.file;
  const awsFolder = 'about-me/aws-test/';
  const awsKey = awsFolder + fileName;

  const awsParams = {
    Bucket: process.env.AWS_BUCKET,
    Key: awsKey
  };

  return s3.deleteObject(awsParams, (err, data) => {
    if (err) {
      console.log(err);
      res.status(err.statusCode).send("Delete unsuccessful: " + err.code);
    } else {
      res.send(`${fileName} deleted.`);
    }
  });
};

exports.ex01upload = (req, res) => {
  const form = formidable({ multiples: true });
  const awsFolder = 'about-me/aws-test/';


  form.parse(req, (err, fields, files) => {
    if (err) console.log('form.parse err', err);
    // console.log('form.parse files', files);
    console.log('form.parse files fired');
  });

  form.on('file', (formname, file) => {
    console.log('form.on file.filepath', file.filepath);
    console.log('form.on file.originalFilename', file.originalFilename);

    let awsKey = awsFolder + file.originalFilename;

    fs.readFile(file.filepath, (err, data) => {
      console.log('readFile err', err);
      console.log('readFile data', data);

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
          console.log(`S3: ${awsKey} uploaded successfully`);
        }
      });
    });
  })

  form.once('end', () => {
    console.log('form.once end');
    res.send("done");
  });
};

exports.ex02upload = (req, res) => {
  const form = formidable({ multiples: true });
  const awsFolder = 'about-me/aws-test/';

  form.parse(req, (err, fields, files) => {
    if (err) console.log('form.parse err', err);
    // console.log('form.parse files', files);
    console.log('form.parse files fired');
  });

  form.on('file', (formname, file) => {
    console.log('form.on file.filepath', file.filepath);
    console.log('form.on file.originalFilename', file.originalFilename);

    let awsKey = awsFolder + file.originalFilename;
    let dataStream = fs.createReadStream(file.filepath);
    dataStream.on('open', () => {
      console.log("dataStream.on open: fired");
    });

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
        console.log(`S3: ${awsKey} uploaded successfully`);         
      }
    });
  });

  form.once('end', () => {
    res.send("done");
    console.log('form.once end');
  });
};

exports.ex03upload = (req, res) => {
  const form = formidable({ multiples: true });
  const awsFolder = 'about-me/aws-test/';

  form.parse(req, (err, fields, files) => {
    if (err) console.log('form.parse err', err);
    // console.log('form.parse files', files);
    console.log('form.parse files fired');
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

    dataStream.on('error', (err) => console.log(err));
    dataStream.on('open', () => {
      console.log("dataStream.on open: fired");
      dataStream.pipe(UploadStream(s3, awsParams));
    });
    dataStream.on('data', (data) => {
      console.log(`dataStream.on data: ${data}`);
    })
    dataStream.on('close', () => {
      console.log(`S3: ${awsKey} uploaded to the bucket.`);
    });
  });

  form.once('end', () => {
    res.send("done");
    console.log('form.once end');
  });
};

exports.ex04upload = (req, res) => {
  const form = formidable({ multiples: false });
  const awsFolder = 'about-me/aws-test/';

  form.parse(req, (err, fields, files) => {
    if (err) console.log('form.parse err', err);
    // console.log('form.parse files', files);
    console.log('form.parse files fired');
  });

  form.on('file', (formname, file) => {
    console.log('form.on file.filepath', file.filepath);
    console.log('form.on file.originalFilename', file.originalFilename);

    let awsKey = awsFolder + file.originalFilename;

    fs.readFile(file.filepath, (err, data) => {
      console.log('readFile err', err);
      console.log('readFile data', data);

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
          console.log(`S3: ${awsKey} uploaded successfully`);
          res.send("done");
        }
      });
    });
  });

  form.once('end', () => {
    console.log('form.once end');
  });
};