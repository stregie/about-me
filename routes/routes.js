const express = require ('express');
const router = express.Router();

const controllers = require('../controllers/01_general.js');
const snake = require('../controllers/04_snake.js');
const news = require('../controllers/05_news.js');
const fileuploader = require('../controllers/06_fileuploader.js');
const react = require('../controllers/07_react.js');

const fileuploaderAws = require('../controllers/06_fileuploader-awstest.js');

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

router.get('/fileuploader/', fileuploader.main);
router.get('/fileuploader/filelist', fileuploader.fileList);
router.post('/fileuploader/upload', fileuploader.upload);
router.get('/fileuploader/download', fileuploader.download);
router.get('/fileuploader/delete', fileuploader.delete);

// router.post('/fileuploader/uploadfiles', fileuploader.fileuploaderPostFiles);
// router.get('/fileuploader/download/', fileuploader.fileuploaderDownload);

router.get('/fileuploader-awstest/', fileuploaderAws.main);
router.get('/fileuploader-awstest/objectList', fileuploaderAws.objectList);
router.get('/fileuploader-awstest/delete', fileuploaderAws.delete);
router.post('/fileuploader-awstest/ex01upload', fileuploaderAws.ex01upload);
router.post('/fileuploader-awstest/ex02upload', fileuploaderAws.ex02upload);
router.post('/fileuploader-awstest/ex03upload', fileuploaderAws.ex03upload);
router.post('/fileuploader-awstest/ex04upload', fileuploaderAws.ex04upload);

router.get('/react/*', react.main);
router.get('/reactapi/getfilelist/', react.fileList);
router.get('/reactapi/images/:album/:image', react.sendImage);

router.get('/mongotest/', controllers.mongotest);

module.exports = router;