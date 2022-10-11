const mongoose = require("mongoose")

const RoomSchema = new mongoose.Schema({
     creator_id: {
          type: Number,
          required: true
     },
     creator_name: {
          type: String,
          required: true
     },
     room_name: {
          type: String,
          required: true
     },
     room_language: {
          type: String,
          required: true
     },
     room_members_count: {
          type: Number,
          required: true
     },
     room_members: {
          type: Array,
          required: true
     },
     room_active: {
          type: Boolean
     },
     room_created: {
          type: String,
          required: true
     }
})

const Room = mongoose.model("rooms", RoomSchema)

module.exports = 
     Room