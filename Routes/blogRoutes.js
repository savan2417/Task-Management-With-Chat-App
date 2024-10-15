const express = require("express");
const { handleCreateBlog, handleGetBlogForm, handleGetBlogBeforeEdit, handleEditTheBlog, handleDeleteBlog, handleGetViewPage, handleComment } = require("../Controllers/blogController");
const multer = require("multer");
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage })


router.get("/addData", handleGetBlogForm)
router.post("/addData",upload.single('image'), handleCreateBlog);
router.get("/editData/:id",handleGetBlogBeforeEdit );
router.post("/editinfo/:id",upload.single('image'), handleEditTheBlog)

router.get("/deleteData/:id", handleDeleteBlog );
router.get("/view/:id", handleGetViewPage)

router.post("/comment/:blogId", handleComment)




module.exports = router