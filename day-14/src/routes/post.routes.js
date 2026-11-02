const express = require("express")
const postController = require("../controllers/post.controller")
const postRouter = express.Router()
const multer = require("multer")
const upload = multer({storage:multer.memoryStorage()})
const { identifyUser } = require("../middlewares/auth.middleware")
/*
 * POST /api/posts [protected]
   ? - req.body = { caption, image-file }
*/

postRouter.post("/",upload.single("image"),identifyUser, postController.createPostController)

/*
 * GET /api/posts [protected]
*/

postRouter.get("/", identifyUser, postController.getPostsController)

/*
 * GET /api/posts/details/:postid
   ? - return an details about specific post with postid. also check weather the post belongs to the user or not. if not then return 401 unauthorized access.
*/

postRouter.get("/details/:postId", identifyUser, postController.getPostDetailsController)


module.exports = postRouter ;