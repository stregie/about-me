const express = require ('express');
const router = express.Router();
const ejs = require ('ejs');

// const controller01 = require('../controllers/controller01.js');

router.get('/', (req, res) => {
  let pagedata = {};
  ejs.renderFile('./views/01-main.ejs', (err, str) => {
    pagedata.content = str;
    res.render('00-frame.ejs', pagedata);
  });
});

router.get('/snake', (req, res) => {
  renderPage(req, res, '02-snake.ejs');
});

// router.get('/01a/', controller01.ctrl01a);
// router.post('/01b/sendmessage', controller01.ctrl01b);

router.get('/c1', (req, res) => {
  renderPage(req, res, '01-main.ejs');
});

function renderPage(req, res, ejsName) {
  let pagedata = {};
  let path = './views/' + ejsName;
  ejs.renderFile(path, (err, str) => {
    pagedata.content = removeHtmlTag(str);
    res.render('00-frame.ejs', pagedata);
  });
};

function removeHtmlTag(html){
  let htmlTagPos = html.indexOf("<html>");
  let perHtmlTagPos = html.indexOf("</html>");
  if (htmlTagPos >= 0 && perHtmlTagPos >= 0){
    return html.slice(htmlTagPos + 7, perHtmlTagPos - 1);
  } else {
    return html;
  }
};

module.exports = router;