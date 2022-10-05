const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
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
     is_active: {
          type: Boolean,
          required: true
     },
     connected: {
          type: Number,
          required: true
     },
})

const User = mongoose.model("User", UserSchema)

module.exports = User