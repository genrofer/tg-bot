const mongoose = require("mongoose")

const AllUserSchema = new mongoose.Schema({
     user_id: {
          type: Number,
          required: true
     },
     name: {
          type: String,
          required: true
     },
     username: {
          type: String,
          required: true
     },
     language: {
          type: String,
          required: true
     },
     joined: {
          type: String,
          required: true
     }
})

const AllUser = mongoose.model("all-users", AllUserSchema)

module.exports = AllUser