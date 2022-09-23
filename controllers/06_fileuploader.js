const AWS = require('aws-sdk');
const fs = require('fs');
const formidable = require('formidable');
const path = require('path');

const s3 = new AWS.S3;

exports.fileuploader = (req, res) => {
	res.render('06_fileuploader.ejs', null);
};

exports.fileuploaderGetUploadedFiles = (req, res) => {
  let dirpath = path.join(__dirname, '..', 'uploaded_files');
  let filelist = [];
  fs.readdir(dirpath, (err, files) => {
    files.forEach((file, index) => {
      filelist[index] = {filename: file};
      let stats = fs.statSync(dirpath + "/" + file);
      filelist[index].filesize = stats.size;
    });
    res.json(filelist);
  });
};

exports.fileuploaderPostFiles = (req, res) => {
  res.send("ok");


}

// exports.fileuploaderPostFiles = (req, res) => {
//   let dirpath = path.join(__dirname, '..', 'uploaded_files');
//   
//   const form = new formidable.IncomingForm();
//   form.multiples = true;
//   form.maxFileSize = 50 * 1024 * 1024; // FieldsSize? Unsure if it is the right property
//   form.uploadDir = dirpath;
// 
//   form.parse(req);
// 
//   form.on('fileBegin', function (name, file) { // name: form name; file: file object. Called when file uploaded but not saved 
//     file.filepath = path.join(dirpath, file.originalFilename);
//   });
// 
//   form.on('file', function (name, file) { // called when file uploaded and saved.   
//     console.log('Uploaded ' + file.originalFilename);      
//   });
// 
//   res.send("Files successfully uploaded!");
// };

exports.fileuploaderDownload = (req, res) => {
  let dirpath = path.join(__dirname, '..', 'uploaded_files');
  console.log(req.query.file);
  let filepath = dirpath + "/" + req.query.file;
  res.download(filepath);
};