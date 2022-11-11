const AWS = require('aws-sdk');
const fs = require('fs');
const formidable = require('formidable');
const path = require('path');

const s3 = new AWS.S3;

exports.main = (req, res) => {
  res.render('06_fileuploader-s3.ejs', null);
};

exports.fileList = (req, res) => {
  const folder = "about-me/fileuploader-s3/";
  const params = {
    Bucket: process.env.AWS_BUCKET
  };

  return s3.listObjects(params, (err, data) => {
    if(err) {
      // if(err.code === "ExpiredToken"){res.status(err.statusCode).res.send("Token has expired")}
      console.log(err);
      res.send(err);
    } else {
      const fileList = [];
      data.Contents.filter((file) => {
        return file.Key.match(folder) !== null
      }).forEach((file) => {
        let lastChar = file.Key.charAt(file.Key.length - 1);
        let notFolder = Boolean(lastChar != "/");
        if (notFolder){
          fileList.push({
            Key: file.Key,
            Name: file.Key.slice(folder.length),
            Size: file.Size
          });
        }
      });
      res.json(fileList);
    }
  });
};

exports.download = (req, res) => {
  let fileName = req.query.file;
  let awsKey = "about-me/" + req.query.folder + "/" + fileName;
  console.log(awsKey);

  const tmpPath = path.join(__dirname, '..', 'tmp', fileName);
  const params = {
    Bucket: process.env.AWS_BUCKET,
    Key: awsKey
  };

  return s3.getObject(params, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      fs.writeFileSync(tmpPath, data.Body);

      res.download(tmpPath, (err) => {
        if (err) {
          console.log(err);
        } else {
          fs.unlink(tmpPath, (err) => {
            if (err) console.log(err);
          });
          // console.log('temporary file deleted');
        }
      });
    }
  });
};

exports.upload = (req, res) => {
  let dirpath = path.join(__dirname, '..', 'tmp');
  let awsFolder = "fileuploader-s3";
  
  const form = new formidable.IncomingForm();
  form.multiples = true;
  form.maxFileSize = 5 * 2 ** 20; // FieldsSize? Unsure if it is the right property
  form.uploadDir = dirpath;

  form.parse(req);

  form.on('fileBegin', function (name, file) { // name: form name; file: file object. Called when file uploaded but not saved 
    file.filepath = path.join(dirpath, file.originalFilename);
  });

  form.on('file', function (name, file) { // called when file uploaded and saved.   
    console.log('Uploaded to tmp: ' + file.originalFilename);
    fs.readFile(file.filepath, (err, data) => {
      console.log(data);
      const params = {
        Bucket: process.env.AWS_BUCKET,
        Body: data,
        Key: "about-me/" + awsFolder + "/" + file.originalFilename
      };
      return s3.upload(params, (err, data) => {
        if(err) {
          console.log(err);
          res.send("not ok");
        } else {
          console.log("Everything went fine I guess");
          console.log("Data: ", data);
          fs.unlink(file.filepath, (err) => {
            if (err) console.log(err);
          });
        }
      });
    });
  });
  res.send("Files uploaded successfully.");
};

// Feladat:
// - res.send-et csak akkor küldje el, ha az összes aws feltöltés megtörtént, hogy a displayFiles ne egy korábbi állapotot mutasson
//   Pl promise-okkal.
// - res.send("not ok") -t is lekezelni valahogy, hogy multiple upload esetén is történjen valami, ha csak egy is hibás.
// - feltölteni cyclic-re és letesztelni
  



// https://medium.com/@tojo.r/download-upload-from-to-aws-s3-using-node-js-5374895f8c30
exports.awsTest = (req, res) => {
  res.render('06a_awstest.ejs', null);
};

exports.awsTestDownload = (req, res) => {
  let fileName = req.query.file;
  let awsKey = req.query.path + fileName;

  const tmpPath = path.join(__dirname, '..', 'tmp', fileName);
  const params = {
    Bucket: process.env.AWS_BUCKET,
    Key: awsKey
  };

  return s3.getObject(params, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      fs.writeFileSync(tmpPath, data.Body);

      res.download(tmpPath, (err) => {
        if (err) {
          console.log(err);
        } else {
          fs.unlink(tmpPath, (err) => {
            if (err) console.log(err);
          });
          console.log('temporary file deleted');
        }
      });
    }
  });
};

exports.awsTestUpload = (req, res) => {
  const filePath = path.join(__dirname, '..', 'tmp', 'bright-idea.jpg');
  fs.readFile(filePath, (err, data) => {
    console.log(data);
    const params = {
      Bucket: process.env.AWS_BUCKET,
      Body: data,
      Key: "about-me/aws-test/bright-idea.jpg"
    };
    return s3.upload(params, (err, data) => {
      if(err) {
        console.log(err);
        res.send("not ok");
      } else {
        console.log("Everything went fine I guess");
        console.log("Data: ", data);
        res.send("ok");
      }
    });
  });
};

exports.awsTestFileList = (req, res) => {
  const folder = "about-me/aws-test/";
  const params = {
    Bucket: process.env.AWS_BUCKET
  };

  return s3.listObjects(params, (err, data) => {
    if(err) {
      res.send(err);
    } else {
      const fileList = data.Contents.filter((file) => {
        return file.Key.match(folder) !== null
      }).map((file) => {
        return {
          Key: file.Key,
          Name: file.Key.slice(folder.length),
          Size: file.Size
        }
      });
      // console.log(fileList);
      res.json(fileList);
    }
  });
};

exports.fileUploaderS3 = (req, res) => {
  res.send("ok");
};