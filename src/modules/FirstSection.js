require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TOKEN;
const bot = new TelegramBot(token);
const { mainOption, mainEngOption, mainRuOption, uzbekOption, englishOption, russianOption, langOption, option } = require("../modules/Options")

const vaqt = new Date()
const year = vaqt.getFullYear()
const month = vaqt.getMonth()
const day = vaqt.getDate()
const hour = vaqt.getHours()
const minute = vaqt.getMinutes()
const now = Date.now()

const User = require("../mongo/User")

const Start = async (msg, chatId, Room) => {
     const users = await User.find({})

     if (msg.text == '/start') {
          const Rooms = await Room.find({})
          const selectedRoom = []
          const selectedUser = []
          const roomMembers = []
          Rooms.map(room => {
               room.room_members.length > 0 ? room.room_members.map(async member => {
                    if (member.user_id == chatId) {
                         selectedUser.push(member)
                         selectedRoom.push(room)
                    }
               }) : null
          })
          selectedRoom[0]?.room_members?.length > 0 ? selectedRoom[0]?.room_members?.map(async member => {
               roomMembers.push(member.user_id)
          }) : null
          try {
               await Room.findById(selectedRoom[0]?._id, (err, deleteUserRoom) => {
                    if (deleteUserRoom) {
                         deleteUserRoom.room_members[selectedUser[0]?.id - 1] = {
                              id: selectedUser[0].id,
                              user_id: 0,
                              name: 'undefined',
                              username: 'undefined'
                         }
                         deleteUserRoom.save()
                    }
               })
          } catch (error) {
               console.log(error)
          }
          roomMembers?.length > 0 ? roomMembers?.map(item => {
               if (item != 0 && item != chatId) {
                    bot.sendMessage(item, `${msg.chat.first_name} guruhni tark etdi.`)
               }
          }) : null

          setTimeout(async () => {
               const roomUsers = []
               const deleteRoom = []
               Rooms.map(room => {
                    room.room_members?.map(async member => {
                         if (member.user_id != chatId) {
                              room.room_members?.map(delRoom => {
                                   if (delRoom.user_id != chatId) {
                                        roomUsers?.push(delRoom.user_id)
                                   }
                              })
                         }
                    })
               })
               roomUsers?.map(ite => {
                    if (ite > 10) {
                         deleteRoom.push(1)
                         console.log(deleteRoom)
                    }
               })
               if (deleteRoom.includes(1)) {
                    console.log("Roomda odam bor")
                    return;
               } else {
                    await Room.findByIdAndRemove(selectedRoom[0]?._id).exec()
                    console.log(`${selectedRoom[0]?.room_name} deleted`)
               }
          }, 180000);

          const lastMsg = msg.message_id - 1
          bot.deleteMessage(msg.chat.id, lastMsg ? lastMsg : null)
          bot.sendMessage(msg.from.id, `<i>Start ♻️</i>`, {
               reply_markup: {
                    remove_keyboard: true
               },
               "parse_mode": "HTML"
          });

          users?.map(user => {
               if (user.user_id == chatId) {
                    users?.map(async item => {
                         if (item.user_id == user.connected) {
                              await User.findByIdAndRemove(item._id).exec()
                              await User.findByIdAndRemove(user._id).exec()

                              bot.sendMessage(item.user_id, `${user.name.bold()} bilan suhbatingiz yakunlandi. \nYangi suhbatni boshlash uchun ${'suhbatdosh'.bold()} buyrug'ini bosing !`, option)
                              bot.sendMessage(chatId, `${item.name.bold()} bilan suhbatingiz yakunlandi.`, option)
                         }
                    })
               }
          })

          setTimeout(() => {
               bot.sendMessage(msg.from.id, `Choose your language 👇🏻`, langOption);
          }, 1000);
     }
}

const Main = async (msg, chatId, name, Room, users, User) => {
     let user_room = {}
     const Rooms = await Room.find({})
     const all_rooms = []
     var userRoom;
     var keyboard = {}

     Rooms?.map(room => {
          all_rooms.push(room.creator_id)
          if (room.creator_id == chatId) {
               user_room = room
          }
          room.room_members.map(member => {
               if (member.user_id == chatId) {
                    userRoom = true
                    user_room = room
               }
          })
     })

     keyboard = {
          remove_keyboard: true
     }

     if (userRoom) {
          keyboard = {
               keyboard: [
                    [{
                         text: `leave ${user_room.room_name}🚪`,
                    }]
               ],
               resize_keyboard: true
          }
     }

     if (msg.text == 'Main 🏠') {
          const lastMsg = msg.message_id - 1
          bot.deleteMessage(msg.chat.id, lastMsg ? lastMsg : null)

          users?.map(async user => {
               if (user.user_id == chatId && user.connected == 0 && user.is_active == true) {
                    await User.findByIdAndRemove(user._id).exec()
               }
          })
          bot.sendMessage(msg.chat.id, "Main 🏠", {
               reply_markup: JSON.stringify(keyboard)
          });
     }

     setTimeout(() => {
          if (msg.text == 'Main 🏠') {
               bot.sendMessage(chatId, `Xush kelibsiz ${name} 🎩\nTanlang 👇`, mainOption)
          }
     }, 500);
}

const SelectLang = (action, msg, chatId, name, username, AllUsers, all_users) => {
     var userIds = []
     const addNewToUsers = async (lang) => {
          all_users?.map(user => {
               userIds.push(user.user_id)
          })

          if (!userIds.includes(chatId)) {
               const user = new AllUsers({
                    user_id: chatId,
                    name: name,
                    username: username ? username : 'undefined',
                    language: lang,
                    joined: `${hour}:${minute}--${day}.${month}.${year}`
               })
               try { await user.save() } catch (error) { console.log(error) }
          }
     }

     // Language select
     if (action === 'uzbek') {
          bot.deleteMessage(chatId, msg.message_id)
          console.log("safsafsfa")
          bot.sendMessage(chatId, `Ayni damda Text geno orqali millionlab odamlar suhbatlashishmoqda 😍 \n\nKo'plab do'stlar topishga tayyormisiz ?`, uzbekOption)
     }

     if (action === 'english') {
          bot.deleteMessage(chatId, msg.message_id)
          bot.sendMessage(chatId, `Millions of people are chatting on Text Geno right now 😍 \n\nAre you ready to make a lot of friends?`, englishOption)
     }

     if (action === 'russian') {
          bot.deleteMessage(chatId, msg.message_id)
          bot.sendMessage(chatId, `Миллионы людей прямо сейчас общаются в Text Geno 😍 \n\nГотовы ли вы завести много друзей?`, russianOption)
     }

     // Go option
     if (action === 'gouzbek') {
          bot.deleteMessage(chatId, msg.message_id)
          bot.sendMessage(chatId, `Xush kelibsiz ${name} 🎩\nTanlang 👇`, mainOption)
          addNewToUsers('uzbek')
     }

     if (action === 'goenglish') {
          bot.deleteMessage(chatId, msg.message_id)
          bot.sendMessage(chatId, `Welcome ${name} 🎩\nChoose 👇`, mainEngOption)
          addNewToUsers('english')
     }

     if (action === 'gorussian') {
          bot.deleteMessage(chatId, msg.message_id)
          bot.sendMessage(chatId, `Добро пожаловать, ${name} 🎩\nВыберите 👇`, mainRuOption)
          addNewToUsers('russian')
     }
}
module.exports = {
     Start,
     SelectLang,
     Main,
}