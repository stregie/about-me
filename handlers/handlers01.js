const fs = require('fs');
const formidable = require('formidable');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const mongoUrl = "mongodb+srv://st:gSaCRgRWC4niM4fd@introduction-site.8s83u.mongodb.net/?retryWrites=true&w=majority";

exports.main = (req, res) => {
  res.render('01-main.ejs', null);
};

exports.snake = (req, res) => {
  res.render('02-snake.ejs', null);
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
      res.render('03-mongotest.ejs', mongodat);
    });
  });
};

exports.fileuploader = (req, res) => {
	res.render('04-fileuploader.ejs', null);
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
  let dirpath = path.join(__dirname, '..', 'uploaded_files');
  
  const form = new formidable.IncomingForm();
  form.multiples = true;
  form.maxFileSize = 50 * 1024 * 1024; // FieldsSize? sth doesnt work now.
  form.uploadDir = dirpath;

  form.parse(req);

  form.on('fileBegin', function (name, file) { // name: form name; file: file object. Called when file uploaded but not saved 
    file.filepath = path.join(dirpath, file.originalFilename);
  });

  form.on('file', function (name, file) { // called when file uploaded and saved.   
    console.log('Uploaded ' + file.originalFilename);      
  });

  res.send("Files successfully uploaded!");
};

exports.fileuploaderDownload = (req, res) => {
  let dirpath = path.join(__dirname, '..', 'uploaded_files');
  console.log(req.query.file);
  let filepath = dirpath + "/" + req.query.file;
  res.download(filepath);
};

exports.blog = (req, res) => {
  res.render('05-blog.ejs', null);
};

exports.blogArticle = (req, res) => {
  fs.readFile('./data/json/blog/Aboutme-structure.json', (err, data) => {
    res.render('05-blog-display.ejs', JSON.parse(data));
  })
}

exports.blogEditor = (req, res) => {
  res.render('05-blog-editor.ejs', null);
};