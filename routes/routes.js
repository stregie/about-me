const express = require ('express');
const router = express.Router();

const ejs = require ('ejs');


const handlers = require('../handlers/01_handlers.js');
const snake = require('../handlers/04_snake.js');
const news = require('../handlers/05_news.js');
const fileuploader = require('../handlers/06_fileuploader.js');

router.get('/', handlers.main);
router.get('/aboutme/', handlers.aboutme);
router.get('/snake/', snake.game);
router.post('/snake/postScore/', snake.postScore);
router.get('/snake/getScore/', snake.getScore);

router.get('/contact/', handlers.contact);
router.post('/contact/submit/', handlers.contactGet);
// router.get('/contact/', handlers.contactSendNotification);

router.get('/news/', news.articleList);
router.get('/news/article/:articleid', news.articleDisplay);
router.get('/news/editor/', news.articleListEdit);
router.get('/news/editor/edit/', news.articleEdit);
router.get('/news/editor/checkid/', news.checkID);
router.post('/news/editor/insert', news.insert);
router.post('/news/editor/update', news.update);
router.post('/news/editor/delete', news.delete);

router.get('/fileuploader/', fileuploader.fileuploader);
router.get('/fileuploader/getuploadedfiles', fileuploader.fileuploaderGetUploadedFiles);
router.post('/fileuploader/uploadfiles', fileuploader.fileuploaderPostFiles);
router.get('/fileuploader/download/', fileuploader.fileuploaderDownload);

router.get('/mongotest/', handlers.mongotest);

module.exports = router;