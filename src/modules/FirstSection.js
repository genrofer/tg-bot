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

const Start = (msg, users) => {
     if (msg.text == '/start') {
          bot.sendMessage(msg.from.id, `Choose your language 👇🏻`, langOption);
     }
}

const Main = async (msg, chatId, name, Room) => {
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
     Main
}