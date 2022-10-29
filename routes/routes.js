const express = require ('express');
const router = express.Router();

const ejs = require ('ejs');

const controllers = require('../controllers/01_general.js');
const snake = require('../controllers/04_snake.js');
const news = require('../controllers/05_news.js');
const fileuploader = require('../controllers/06_fileuploader.js');
const react = require('../controllers/07_react.js');

router.get('/', controllers.main);
router.get('/aboutme/', controllers.aboutme);
router.get('/snake/', snake.game);
router.post('/snake/postScore/', snake.postScore);
router.get('/snake/getScore/', snake.getScore);

router.get('/contact/', controllers.contact);
router.post('/contact/submit/', controllers.contactSubmit);

router.get('/news/', news.articleList);
router.get('/news/article/:articleid', news.articleDisplay);
router.get('/news/editor/', news.articleListEdit);
router.get('/news/editor/edit/', news.articleEdit);
router.get('/news/editor/checkid/', news.checkID);
router.post('/news/editor/insert', news.insert);
router.post('/news/editor/update', news.update);
router.post('/news/editor/delete', news.delete);
router.get('/news/editor/images/', news.images);

router.get('/fileuploader/', fileuploader.fileuploader);
router.get('/fileuploader/getuploadedfiles', fileuploader.fileuploaderGetUploadedFiles);
router.post('/fileuploader/uploadfiles', fileuploader.fileuploaderPostFiles);
router.get('/fileuploader/download/', fileuploader.fileuploaderDownload);

router.get('/react/*', react.main);
router.get('/reactapi/getfilelist/', react.fileList);
router.get('/reactapi/images/:album/:image', react.sendImage);

router.get('/mongotest/', controllers.mongotest);

module.exports = router;