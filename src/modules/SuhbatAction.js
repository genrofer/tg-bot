require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TOKEN;
const bot = new TelegramBot(token);

const { option, exitRoom, replyKeyboard } = require("../modules/Options")

const SuhbatAction = async (action, msg, chatId, name, username, users, userLength, User, Room) => {
     if (action === 'suhbat') {
          bot.deleteMessage(chatId, msg.message_id)

          let user_room = {}
          const Rooms = await Room.find({})
          const all_rooms = []
          var userRoom;

          Rooms?.map(room => {
               all_rooms.push(room.creator_id)
               if (room.creator_id == chatId) {
                    user_room = room
               }

               room.room_members?.map(member => {
                    if (member.user_id == chatId) {
                         userRoom = true
                         user_room = room
                    }
               })
          })
 
          if (userRoom) {
               bot.sendMessage(chatId, `Siz ${user_room.room_name} nomli xonada borsiz. Uni tark etishni xoxlaysizmi ?`, exitRoom)
          } else {
               users?.map(async user => {
                    if (user.is_active == true && user.user_id != chatId) {
                         const changeId = users.find(e => e.is_active == true)
                         console.log(changeId)
                         const user = new User({
                              user_id: chatId,
                              name: name,
                              username: username ? username : 'undefined',
                              is_active: false,
                              connected: changeId.user_id
                         })
                         try { await user.save() } catch (error) { console.log(error) }

                         try {
                              await User.findById(changeId._id, (err, updatedUser) => {
                                   updatedUser.is_active = false
                                   updatedUser.connected = chatId
                                   updatedUser.save()
                              })
                         } catch (error) {
                              console.log(error)
                         }

                         bot.sendMessage(chatId, `Siz ${changeId.name.bold()} bilan bog'landingiz ! \nSuhbatni yakunlash uchun /stop ni bosing.`, option)
                         bot.sendMessage(changeId.user_id, `Siz ${name.bold()} bilan bog'landingiz ! \nSuhbatni yakunlash uchun /stop ni bosing.`, option)
                    }

                    if (user.user_id == chatId && user.is_active == true) {
                         // bot.sendMessage(chatId, `Sizga suhbatdosh qidiryapma-a-a-a-n !!!!!`)
                    }

                    if (user.is_active == false && user.connected == chatId) {
                         bot.sendMessage(chatId, `Siz <b>${user.name}</b> bilan suhbatlashyapsiz. \nSuhbatni yakunlash uchun /stop ni bosing.`, option)
                    }

                    if (user.user_id == chatId && user.is_active == false && user.connected == 0) {
                         const editedUser = model.editUser(true, 0, chatId)
                         bot.sendMessage(chatId, 'Sizga mos suhbatdosh qidirlmoqda..222.')
                         return editedUser
                    }
               })

               if (users[userLength - 1]?.is_active == false && users[userLength - 1]?.user_id != chatId && users[userLength - 1]?.connected != 0 || users.length <= 0) {
                    const user = new User({
                         user_id: chatId,
                         name: name,
                         username: username ? username : 'undefined',
                         is_active: true,
                         connected: 0
                    })
                    try { await user.save() } catch (error) { сonsole.log(error) }
                    bot.sendMessage(chatId, 'Sizga mos suhbatdosh qidirlmoqda...7', replyKeyboard)
               }
          }
     }
}

module.exports = {
     SuhbatAction
}