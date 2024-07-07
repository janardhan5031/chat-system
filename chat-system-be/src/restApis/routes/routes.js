const express = require('express');
const multer  = require('multer')

const router = express.Router();

const authController = require("../controllers/authController");
const postController = require("../controllers/postController")
const authMiddleware = require("../../utilities/middlewares/authMiddleware")

const storage = multer.memoryStorage();   // slipts the incoming file/ files into chunks

const upload = multer({storage:storage}); 

router.post(`/login`,authController.login);

router.post('/create-post',
    upload.single('file') ,
    authMiddleware.authMiddleware ,
    postController.createPost
);

router.get('/get-posts',
    authMiddleware.authMiddleware,
    postController.getPosts
)

router.get("/get-comments",
    authMiddleware.authMiddleware,
    postController.getPostComments
)

module.exports = router;