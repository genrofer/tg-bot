require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TOKEN;
const bot = new TelegramBot(token);

const { roomLang, roomMemberCount, deleteRoom, mainOption, roomConfirm, exitRoom, option } = require("../modules/Options")

const RoomAction = async (action, msg, chatId, Room, name) => {
     const Rooms = await Room.find({})
     const all_rooms = []
     let user_room = {}

     Rooms?.map(room => {
          all_rooms.push(room.creator_id)
          if (room.creator_id == chatId) {
               user_room = room
          }
     })

     const allRoomsArr = [[{ text: 'Yangi room ochish', callback_data: 'newroom' }]]

     Rooms.length >= 1 ? Rooms.map(room => {
          var roomLang = null
          var activeMembers = 0
          if (room.room_language == 'English') {
               roomLang = '🇺🇸'
          } else if (room.room_language == 'Russian') {
               roomLang = '🇷🇺'
          } else if (room.room_language == 'Uzbek') {
               roomLang = '🇺🇿'
          }

          room.room_members.map(active => {
               if (active.user_id != 0) {
                    activeMembers++
               }
          })

          if (room.room_active == true) {
               const newArr = [
                    { text: `${room.room_name} ${roomLang}  ${activeMembers}/${room.room_members.length}`, callback_data: `room ${room._id}` }
               ]
               allRoomsArr.unshift(newArr)
          }
     }) : null

     var AllRooms = {
          reply_markup: JSON.stringify({
               inline_keyboard: allRoomsArr
          }),
          "parse_mode": "HTML"
     };

     var replyKeyboard = {
          reply_markup: JSON.stringify({
               keyboard: [
                    [{
                         text: 'Main 🏠',
                    }, {
                         text: '🇫🇷 Français',
                    }]
               ],
               resize_keyboard: true
          }),
          "parse_mode": "HTML"
     };


     if (action === 'room') {
          var ActiveRooms = 0
          Rooms?.map(room => {
               if (room.room_active == true) {
                    ActiveRooms++
               }
          })
          bot.deleteMessage(chatId, msg.message_id)
          bot.sendMessage(chatId, `Room 🚪`, replyKeyboard)
          setTimeout(() => {
               bot.sendMessage(chatId, `Roomlar soni ${ActiveRooms} ta`, AllRooms)
          }, 500);
     }
     const splitedAction = action?.split(' ')
     console.log(splitedAction)
     if (splitedAction[0] == 'room') {
          if (action === `room ${splitedAction[1]}`) {
               Rooms.map(async room => {

                    // 
                    if (room._id == splitedAction[1]) {
                         var userHasRoom = []
                         var memberHasRoom = []

                         Rooms.map(async clean => {
                              clean.room_members?.map(item => {
                                   if (item.user_id == chatId) [
                                        userHasRoom.push(clean)
                                   ]
                              })
                              userHasRoom[0]?.room_members?.map(member => {
                                   if (member.user_id != 0) {
                                        memberHasRoom.push(member.user_id)
                                   }
                              })
                         })

                         const joyBor = []
                         room.room_members?.map(item => {
                              joyBor.push(item.user_id)
                         })

                         if (joyBor.includes(0)) {
                              const unactiveUsers = []
                              // bot.deleteMessage(chatId, msg.message_id)
                              room.room_members.map(async member => {
                                   if (member.user_id == 0) {
                                        unactiveUsers.push(member)
                                   }
                              })
                              const roomMembers = []
                              room.room_members.map(async member => {
                                   if (member.user_id != 0) {
                                        roomMembers.push(member.user_id)
                                   }
                              })
                              if (memberHasRoom[0] == chatId) {
                                   bot.sendMessage(chatId, `Siz ${userHasRoom[0].room_name} qo'shilgansiz. Chiqishni xoxlaysizmi?`, exitRoom)
                              } else {
                                   try {
                                        await Room.findById(splitedAction[1], (err, updatedUser) => {
                                             updatedUser.room_members[unactiveUsers[0].id - 1] = {
                                                  id: unactiveUsers[0].id,
                                                  user_id: chatId,
                                                  name: name,
                                                  username: msg.chat.username ? msg.chat.username : 'undefined'
                                             }
                                             updatedUser.save()
                                        })
                                   } catch (error) {
                                        console.log(error)
                                   }
                                   roomMembers.map(item => {
                                        if (item.user_id != 0) {
                                             bot.sendMessage(item, `Guruhga ${msg.chat.first_name} qo'shildi.`)
                                        }
                                   })
                                   bot.sendMessage(chatId, `Siz ${room.room_name} guruhiga qo'shildingiz.\nChiqish uchun /leave ni bosing`, {
                                        reply_markup: {
                                             keyboard: [
                                                  [{
                                                       text: `leave ${room.room_name}🚪`,
                                                  }]
                                             ],
                                             resize_keyboard: true
                                        }
                                   })

                                   const activeAzolar = [] 

                                   room.room_members?.map(mem => {
                                        if(mem.user_id != 0 && mem.user_id != chatId){
                                             activeAzolar.push(`${mem.name}`)
                                        }
                                   })
                                   var arr_2 = activeAzolar.join("\n")

                                   setTimeout(() => {
                                        bot.sendMessage(chatId, `Guruhda aktiv azolar \n\n${arr_2}`)
                                   }, 1000);
                              }
                         } else {
                              bot.deleteMessage(chatId, msg.message_id)
                              bot.sendMessage(chatId, `Xonada bo'sh joy yoq.`, mainOption)
                         }
                    }
               })
          }
     }

     if (action === 'newroom') {
          bot.deleteMessage(chatId, msg.message_id)

          let user_room = {}
          const Rooms = await Room.find({})
          const all_rooms = []
          const selectedRoom = []
          var userRoom;

          Rooms?.map(room => {
               all_rooms?.push(room.creator_id)
               if (room.creator_id == chatId) {
                    selectedRoom.push(room)
               }
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

          console.log(all_rooms)
          console.log(selectedRoom)

          if (all_rooms.includes(chatId) && selectedRoom[0].room_active == false) {
               await Room.findByIdAndRemove(selectedRoom[0]._id).exec()
          }

          if (all_rooms.includes(chatId) && selectedRoom[0].room_active == true) {
               bot.sendMessage(chatId, `Sizning ${user_room.room_name} nomli xonangiz mavjud. Uni o'chirishni xoxlaysizmi ?`, deleteRoom)
          } else if (userRoom) {
               bot.sendMessage(chatId, `Siz ${user_room.room_name} nomli xonada borsiz. Uni tark etishni xoxlaysizmi ?`, exitRoom)
          } else {
               // bot.deleteMessage(chatId, msg.message_id)
               const room = new Room({
                    creator_id: chatId,
                    creator_name: msg.chat.first_name,
                    room_name: 'undefined',
                    room_language: 'undefined',
                    room_members_count: 0,
                    room_members: [],
                    room_active: false
               })
               try { await room.save() } catch (error) { console.log(error) }
               bot.sendMessage(chatId, `Roomga ism kiriting \n\nMasalan: Suhbatlashish`)
          }
     }

     if (action === 'deletemyroom') {
          let user_room = {}
          bot.deleteMessage(chatId, msg.message_id)

          const Rooms = await Room.find({})
          const all_rooms = []

          Rooms?.map(room => {
               all_rooms.push(room.creator_id)
               if (room.creator_id == chatId) {
                    user_room = room
               }
          })

          bot.sendMessage(chatId, `Xonangiz o'chirildi ✅`)
          await Room.findByIdAndRemove(user_room._id).exec()

          setTimeout(async () => {
               bot.sendMessage(chatId, `Xush kelibsiz ${name} 🎩\nTanlang 👇`, mainOption)
          }, 1000);

     } else if (action === 'dontdeletemyroom') {
          bot.deleteMessage(chatId, msg.message_id)
          bot.sendMessage(chatId, `Xush kelibsiz ${name} 🎩\nTanlang 👇`, mainOption)
     }

     if (action === 'confirm') {
          if (all_rooms.includes(chatId) && user_room.creator_name == msg.chat.first_name && user_room.room_name != 'undefined' && user_room.room_language != 'undefined' && user_room.room_members != 0) {
               bot.deleteMessage(chatId, msg.message_id)
               try {
                    await Room.findById(user_room._id, (err, updatedUser) => {
                         updatedUser.room_active = true
                         updatedUser.room_members[0] = {
                              id: 1,
                              user_id: chatId,
                              name: name,
                              username: msg.chat.username ? msg.chat.username : 'undefined'
                         }
                         updatedUser.save()
                    })
               } catch (error) {
                    console.log(error)
               }
               bot.sendMessage(chatId, `Guruhingiz yaratildi ✅\n\nKimdir kelishini kuting.`)
          }
     }

     if (action === 'dontconfirm') {
          bot.deleteMessage(chatId, msg.message_id)
          await Room.findByIdAndRemove(user_room._id).exec()
          bot.sendMessage(chatId, `Xush kelibsiz ${name} 🎩\nTanlang 👇`, mainOption)
     }

     if (action === 'exitRoom' || msg.text == '/leave') {
          bot.deleteMessage(chatId, msg.message_id)
          const selectedRoom = []
          const selectedUser = []
          const roomMembers = []
          Rooms.map(room => {
               room.room_members?.map(async member => {
                    if (member.user_id == chatId) {
                         selectedUser.push(member)
                         selectedRoom.push(room)
                    }
               })
          })
          selectedRoom[0]?.room_members.length > 0 ? selectedRoom[0].room_members.map(async member => {
               roomMembers.push(member.user_id)
          }) : null
          try {
               await Room.findById(selectedRoom[0]?._id, (err, deleteUserRoom) => {
                    deleteUserRoom.room_members[selectedUser[0].id - 1] = {
                         id: selectedUser[0].id,
                         user_id: 0,
                         name: 'undefined',
                         username: 'undefined'
                    }
                    deleteUserRoom.save()
               })
          } catch (error) {
               console.log(error)
          }
          roomMembers.length > 0 ? roomMembers.map(item => {
               if (item != 0 && item != chatId) {
                    bot.sendMessage(item, `${msg.chat.first_name} guruhni tark etdi.`)
               }
          }) : null

          bot.sendMessage(chatId, `Siz ${selectedRoom[0]?.room_name} guruhidan chiqdingiz`, mainOption)
     }

     if (action === 'dontExit') {
          bot.deleteMessage(chatId, msg.message_id)
          const selectedRoom = []
          Rooms?.map(item => {
               item.room_members?.map(user => {
                    if (user.user_id == chatId) {
                         selectedRoom.push(item)
                    }
               })
          })
          bot.sendMessage(chatId, `Siz ${selectedRoom[0].room_name} xonasidasiz`)
     }
}

const RoomMsg = async (msg, Room, name) => {
     const chatId = msg.chat.id;
     const Rooms = await Room.find({})
     const all_rooms = []
     let user_room = {}
     let selectedRoom = []
     let joinedMembers = []
     const splitedMsg = msg.text ? msg.text.split(' ') : null

     Rooms?.map(room => {
          all_rooms.push(room.creator_id)
          if (room.creator_id == chatId) {
               user_room = room
          }

          room.room_members?.map(member => {
               if (member.user_id == chatId) {
                    selectedRoom = room
               }
          })
     })

     selectedRoom?.room_members?.map(item => {
          if (item.user_id != 0 && item.user_id != chatId) {
               joinedMembers.push(item.user_id)
          }
     })

     if (joinedMembers.length > 0) {
          joinedMembers.map(item => {
               if (msg.text != '/start' && msg.text != '/leave' && splitedMsg[0] != 'leave') {
                    bot.sendMessage(item, `<i><b>${name}</b></i>\n${msg.text}`, {
                         reply_markup: {
                              keyboard: [
                                   [{
                                        text: `leave ${user_room.room_name}🚪`,
                                   }]
                              ],
                              resize_keyboard: true
                         },
                         parse_mode: 'HTML'
                    })
               }
          })
     }

     if (msg.text == '/leave' || splitedMsg[0] == 'leave') {
          bot.deleteMessage(chatId, msg.message_id)
          const selectedRoom = []
          const selectedUser = []
          const roomMembers = []
          Rooms.map(room => {
               room.room_members?.map(async member => {
                    if (member.user_id == chatId) {
                         selectedUser.push(member)
                         selectedRoom.push(room)
                    }
               })
          })
          selectedRoom[0]?.room_members.length > 0 ? selectedRoom[0].room_members.map(async member => {
               roomMembers.push(member.user_id)
          }) : null
          try {
               await Room.findById(selectedRoom[0]?._id, (err, deleteUserRoom) => {
                    deleteUserRoom.room_members[selectedUser[0].id - 1] = {
                         id: selectedUser[0].id,
                         user_id: 0,
                         name: 'undefined',
                         username: 'undefined'
                    }
                    deleteUserRoom.save()
               })
          } catch (error) {
               console.log(error)
          }
          roomMembers.length > 0 ? roomMembers.map(item => {
               if (item != 0 && item != chatId) {
                    bot.sendMessage(item, `${msg.chat.first_name} guruhni tark etdi.`)
               }
          }) : null
          bot.sendMessage(msg.chat.id, "<i>exited</i>🚪", {
               reply_markup: {
                    remove_keyboard: true
               },
               "parse_mode": "HTML"
          });
          setTimeout(async () => {
               const roomUsers = []
               const deleteRoom = []
               Rooms.map(room => {
                    room.room_members?.map(async member => {
                         if (member.user_id != chatId) {
                              room.room_members?.map(delRoom => {
                                   if (delRoom.user_id != chatId) {
                                        roomUsers.push(delRoom.user_id)
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
          setTimeout(() => {
               bot.sendMessage(chatId, `Siz ${selectedRoom[0]?.room_name} guruhidan chiqdingiz`, mainOption)
          }, 1000);
     }

     if (all_rooms.includes(chatId) && user_room.creator_name == msg.chat.first_name && user_room.room_name == 'undefined' && msg.text != '/start' && msg.text != '/leave' && msg.text != 'Main 🏠') {
          bot.deleteMessage(chatId, msg.message_id - 1)
          try {
               await Room.findById(user_room._id, (err, updatedUser) => {
                    updatedUser.room_name = msg.text
                    updatedUser.save()
               })
          } catch (error) {
               console.log(error)
          }
          bot.sendMessage(chatId, `${msg.text} guruhi uchun til tanlang 👇`, roomLang)
     }
}

const RoomLang = async (msg, Room, action) => {
     const chatId = msg.chat.id;
     const Rooms = await Room.find({})
     const all_rooms = []
     let user_room = {}

     Rooms?.map(room => {
          all_rooms.push(room.creator_id)
          if (room.creator_id == chatId) {
               user_room = room
          }
     })

     if (all_rooms.includes(chatId) && user_room.creator_name == msg.chat.first_name && user_room.room_language == 'undefined' && user_room.room_name != 'undefined') {
          bot.deleteMessage(chatId, msg.message_id)
          if (action === 'roomUzbek') {
               try {
                    await Room.findById(user_room._id, (err, updatedUser) => {
                         updatedUser.room_language = 'Uzbek'
                         updatedUser.save()
                    })
               } catch (err) {
                    console.log(err)
               }
               bot.sendMessage(chatId, `Roomga nechta inson qo'shila oladi? \n\nMasalan 6 ta`, roomMemberCount)
          }
          if (action === 'roomEnglish') {
               try {
                    await Room.findById(user_room._id, (err, updatedUser) => {
                         updatedUser.room_language = 'English'
                         updatedUser.save()
                    })
               } catch (err) {
                    console.log(err)
               }
               bot.sendMessage(chatId, `Roomga nechta inson qo'shila oladi? \n\nMasalan 6 ta`, roomMemberCount)
          }
          if (action === 'roomRussian') {
               try {
                    await Room.findById(user_room._id, (err, updatedUser) => {
                         updatedUser.room_language = 'Russian'
                         updatedUser.save()
                    })
               } catch (err) {
                    console.log(err)
               }
               bot.sendMessage(chatId, `Roomga nechta inson qo'shila oladi? \n\nMasalan 6 ta`, roomMemberCount)
          }
     }
}

const RoomCount = async (msg, Room, action) => {
     const chatId = msg.chat.id;
     const Rooms = await Room.find({})
     const all_rooms = []
     let user_room = {}

     Rooms?.map(room => {
          all_rooms.push(room.creator_id)
          if (room.creator_id == chatId) {
               user_room = room
          }
     })

     if (all_rooms.includes(chatId) && user_room.creator_name == msg.chat.first_name && user_room.room_members_count == 0 && user_room.room_name != 'undefined' && user_room.room_language != 'undefined') {
          bot.deleteMessage(chatId, msg.message_id)
          for (let i = 1; i <= 10; i++) {
               if (action == `${i}member`) {
                    let arr = []
                    for (let g = 0; g < i; g++) {
                         arr.push({
                              id: arr.length + 1,
                              user_id: 0,
                              name: 'undefined',
                              username: 'undefined'
                         })
                    }
                    try {
                         await Room.findById(user_room._id, (err, updatedUser) => {
                              updatedUser.room_members_count = Number(i)
                              updatedUser.room_members = arr
                              updatedUser.save()
                         })
                    } catch (err) {
                         console.log(err)
                    }
                    bot.sendMessage(chatId, `Sizning xonangiz \n\nRoom admini: .\nRoom nomi: ${user_room.room_name}.\nRoom tili: ${user_room.room_language}.\nRoom max. inson: ${i} ta\n\nTasdiqlaysizmi ❓`, roomConfirm)
               }
          }
     }
}

module.exports = {
     RoomAction,
     RoomMsg,
     RoomLang,
     RoomCount
}