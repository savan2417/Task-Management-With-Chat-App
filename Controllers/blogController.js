const Blog = require("../Model/blogModel");
const Comment = require("../Model/comment");
const moment = require("moment"); 

function handleGetBlogForm(req, res){
  try {
    return res.render("addData", {
      user: req.user
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({msg: "Internal Server Error"}); 
  }
}

async function handleCreateBlog(req, res){
  try {
    const body = req.body;

    let image = "";
    if (req.file) {
      image = req.file.path;
    }

    if(!body ||
       !body.title ||
       !body.userName||
       !body.body ||
       !body.status ||
       !body.dueDate ||
       !body.priority
    ){
      return res.status(400).json({message: "Please fill all the fields"});
    }

        // Format the dueDate to DD-MM-YYYY format using moment.js
        const formattedDueDate = moment(body.dueDate).format("DD-MM-YYYY");

    await Blog.create({
      Title: body.title,
      UserName: body.userName,
      Status : body.status,
      DueDate: formattedDueDate,
      Priority: body.priority,
      Body: body.body,
      CreatedBy: req.user._id,
      Image: image,

    })

    return res.redirect("/");

  } catch (error) {
    console.log(error);
    return res.status(500).json({msg: "Internal Server Error"});
  }
}

async function handleGetBlogBeforeEdit(req, res){
  try {
   const id = req.params.id;
   let findBlog =  await Blog.findById(id);

   if(!findBlog){
       return res.status(400).json({ msg: "Task Not Found"});
   }

   return res.render("edit", {
       editdata: findBlog,
       user: req.user

   })
  } catch (error) {
   console.log(error);
   return res.status(500).json({ msg: "Internal Server Error"});
  }
}


async function handleEditTheBlog(req, res){
  try {
      const id = req.params.id;
      const body = req.body;

         // Format the dueDate to DD-MM-YYYY format using moment.js
    const formattedDueDate = moment(body.dueDate).format("DD-MM-YYYY");

      if(req.file){
          let image = req.file.path;

          await Blog.findByIdAndUpdate(id,{
              Title: body.title,
              UserName: body.userName,
              Status: body.status,
              DueDate: formattedDueDate,
              Priority: body.priority,
              Body: body.body,
              Image: image
          })
          console.log("Task details Updated with Image");
          return res.redirect("/");
      }
      else{
          await Blog.findByIdAndUpdate(id,{
              Title: body.title,
              UserName: body.userName,
              Status: body.status,
              DueDate: formattedDueDate,
              Priority: body.priority,
              Body: body.body,
              
          })
          console.log("Task details Updated without Image");
          return res.redirect("/");
      }
  } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Internal Server Error"});     
  }
}

async function handleDeleteBlog(req, res){
  try {
      const id = req.params.id;
      await Blog.findByIdAndDelete(id);
      return res.redirect("/");
  } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Internal Server Error"});
  }
}

async function handleGetViewPage(req, res){
  try {
      const id = req.params.id;
      const blog = await Blog.findById(id).populate("CreatedBy");
      const comments = await Comment.find({blogId: req.params.id}).populate("CreatedBy")
    
    
      return res.render("view",{
          blog: blog,
          user: req.user,
          comments
      }) 
  } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Internal Server Error"});
  }
}

async function handleComment(req, res){
     await Comment.create({
      Content : req.body.content,
      blogId: req.params.blogId,
      CreatedBy: req.user._id
    })

    return res.redirect(`/view/${req.params.blogId}`)
}

module.exports = {
  handleCreateBlog,
  handleGetBlogForm,
  handleGetBlogBeforeEdit,
  handleEditTheBlog,
  handleDeleteBlog,
  handleGetViewPage,
  handleComment
}