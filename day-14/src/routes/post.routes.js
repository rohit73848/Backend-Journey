const express = require("express")
const postController = require("../controllers/post.controller")
const postRouter = express.Router()
const multer = require("multer")
const upload = multer({storage:multer.memoryStorage()})

/*
 * POST /api/posts [protected]
   ? - req.body = { caption, image-file }
*/

postRouter.post("/",upload.single("image"), postController.createPostController)

module.exports = postRouter 