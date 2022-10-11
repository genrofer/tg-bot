require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TOKEN;
const bot = new TelegramBot(token);
const axios = require("axios")

const { option } = require("../modules/Options")

const User = require("../mongo/User")

// Media sending
const sendPhoto = `https://api.telegram.org/bot${token}/sendPhoto`
const sendVideo = `https://api.telegram.org/bot${token}/sendVideo`
const sendSticker = `https://api.telegram.org/bot${token}/sendSticker`
const sendAnimation = `https://api.telegram.org/bot${token}/sendAnimation`
const sendAudio = `https://api.telegram.org/bot${token}/sendAudio`

// Options

const Chatting = (msg, users, chatId, mainOption, name) => {
     const message = msg.text;

     const hiddenInfo = '965916228-Geno-Ferollo'
     if (msg.text == `${hiddenInfo}`) {
          bot.sendMessage(chatId, `${users.length} ta foydalanuvchi\n\n${users}`);
     }

     if (msg.text == '/stop') {
          users?.map(user => {
               if (user.user_id == chatId) {
                    users?.map(async item => {
                         if (item.user_id == user.connected) {
                              await User.findByIdAndRemove(item._id).exec()
                              await User.findByIdAndRemove(user._id).exec()

                              bot.sendMessage(item.user_id, `${user.name.bold()} bilan suhbatingiz yakunlandi. \nYangi suhbatni boshlash uchun ${'suhbatdosh'.bold()} buyrug'ini bosing !`, mainOption)
                              bot.sendMessage(chatId, `${item.name.bold()} bilan suhbatingiz yakunlandi. \nYangi suhbatni boshlash uchun ${'suhbatdosh'.bold()} buyrug'ini bosing !`, mainOption)
                         }
                    })
               }
          })
     }

     users.map(item => {
          if (item.user_id == chatId) {
               const first_text = msg.text?.split('')[0]

               if (item.connected != 0 && first_text != '/' && msg.text != `${hiddenInfo}`) {
                    if (msg.text) {
                         bot.sendMessage(item.connected, `<i><b>${item.name}</b></i>\n${message}`, option);

                    } else if (msg.photo) {
                         let img = msg.photo[2] ? msg?.photo[2]?.file_id : msg?.photo[1]?.file_id
                         axios.get(`${sendPhoto}?chat_id=${item.connected}&photo=${img}`)

                    } else if (msg.video) {
                         const video = msg.video?.file_id
                         axios.get(`${sendVideo}?chat_id=${item.connected}&video=${video}`)

                    } else if (msg.sticker) {
                         const sticker = msg.sticker?.file_id;
                         axios.get(`${sendSticker}?chat_id=${item.connected}&sticker=${sticker}`)
                    } else if (msg.animation) { 
                         const gif = msg.animation?.file_id
                         axios.get(`${sendAnimation}?chat_id=${item.connected}&animation=${gif}`)
                    } else if (msg.audio) {
                         const audio = msg.audio?.file_id
                         axios.get(`${sendAudio}?chat_id=${item.connected}&audio=${audio}`)
                    }
               }
          }
          if (item.user_id == chatId) {
               if (Number(item.connected) < 100 && item.is_active == true && msg.text != '/start' && msg.text != `${hiddenInfo}` && msg.text != `Main 🏠`) {
                    bot.sendMessage(chatId, `Sizga suhbatdosh qidiryapma-a-a-a-n !!!!!`)
               }
          }
     }) 
}

module.exports = {
     Chatting
}