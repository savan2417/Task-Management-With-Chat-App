const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  Title: {
    type: String,
    required: true
  },
  UserName: {
    type: String,
    required: true
  },
  Status : {
    type: String,
    required: true
  },
  DueDate: {
    type: String,
    required: true
  },
  Priority: {
    type: String,
    required: true
  },
  Body: {
    type: String,
    required: true
  },
  Image: {
    type: String,
    required: false
  },
  CreatedBy : {
    type:  mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
},{
   timestamps: true
});

const Blog = mongoose.model("Task", blogSchema);

module.exports = Blog