require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api');
const express = require('express')
const model = require("./modules/model")
const axios = require("axios")
const path = require("path")
const app = express()

app.use(express.json())

app.get("/", async (req, res) => {
    res.send(await model.users())
})

const vaqt = new Date()
const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Media sending

const sendPhoto = `https://api.telegram.org/bot${token}/sendPhoto`
const sendVideo = `https://api.telegram.org/bot${token}/sendVideo`
const sendSticker = `https://api.telegram.org/bot${token}/sendSticker`
const sendAnimation = `https://api.telegram.org/bot${token}/sendAnimation`
const sendAudio = `https://api.telegram.org/bot${token}/sendAudio`

bot.onText(/\/echo (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"
    bot.sendMessage(chatId, resp);
});

var startOption = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: 'Suhbatdosh', callback_data: '1' }, { text: 'Batafsil', callback_data: '1' }],
        ]
    }),
    "parse_mode": "HTML"
};

var option = {
    "parse_mode": "HTML"
};

bot.on('callback_query', async (callbackQuery) => {
    const action = callbackQuery.data;
    const msg = callbackQuery.message;

    const chatId = msg.chat.id;
    var name = msg.chat.first_name;
    const username = msg.chat.username;
    let connected = 0

    const users = await model.users()
    const userLength = users.length

    var regExp = /[a-zA-Z]/g;

    if (regExp.test(name)) {
        let letterMessage = name.replace(/[^a-zA-Z]/gm, "")
        var name = letterMessage
    } else {
        var name = 'undefined'
    }

    if (action === '1') {
        console.log(`${name} suhbatlashishni bosdi`)
        bot.deleteMessage(chatId, msg.message_id)
        users?.map(user => {
            if (user.is_active == true && user.user_id != chatId) {

                user.is_active = false
                const editedUser = model.editUser(false, chatId, user.user_id)
                const newUser = model.newUser(chatId, name, username ? username : 'undefined', false, user.user_id)

                bot.sendMessage(chatId, `Siz ${user.name.bold()} bilan bog'landingiz ! \nSuhbatni yakunlash uchun /stop ni bosing.`, option)
                bot.sendMessage(user.user_id, `Siz ${name.bold()} bilan bog'landingiz ! \nSuhbatni yakunlash uchun /stop ni bosing.`, option)

                return editedUser, newUser
            }

            if (user.user_id == chatId && user.is_active == true) {
                bot.sendMessage(chatId, `Sizga suhbatdosh qidiryapma-a-a-a-n !!!!!`)
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

        if (users[userLength - 1]?.is_active == false && users[userLength - 1]?.user_id != chatId && users[userLength - 1]?.connected != 0) {
            const user = model.newUser(chatId, name, username, true, connected)
            bot.sendMessage(chatId, 'Sizga mos suhbatdosh qidirlmoqda...7')
            return user
        }

        if (users.length <= 0) {
            const user = model.newUser(chatId, name, username ? username : 'undefined', true, connected)
            bot.sendMessage(chatId, 'Sizga mos suhbatdosh qidirlmoqda..3.')
            return user
        }
    }
});


bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    var name = msg.chat.first_name;
    const message = msg.text;

    const users = await model.users()

    var regExp = /[a-zA-Z]/g;
    if (regExp.test(name)) {
        let letterMessage = name.replace(/[^a-zA-Z]/gm, "")
        var name = letterMessage
    } else {
        var name = 'undefined'
    }

    const year = vaqt.getFullYear()
    const month = vaqt.getMonth()
    const day = vaqt.getDate()
    const hour = vaqt.getHours()
    const minute = vaqt.getMinutes()
    const now = Date.now()



    // https://api.telegram.org/file/bot5763389927:AAGwtixD-j7pzwAWFUHVcGbNl9RW1Bggzfs/photos/file_1.jpg


    if (msg.text == '/start') {
        bot.sendMessage(chatId, `Assalamu alaykum. Xush kelibsiz ${name.bold()}.  Suhbatdosh qidirish uchun ${'suhbatdosh'.bold()} buyrug'ini bosing !`, startOption);
        console.log(users)
    }

    if (msg.text == '/stop') {
        users?.map(user => {
            if (user.user_id == chatId) {
                users?.map(item => {
                    if (item.user_id == user.connected) {
                        const deletedUser = model.deleteUser(item.user_id)
                        const deletedUser2 = model.deleteUser(chatId)
                        bot.sendMessage(item.user_id, `${user.name.bold()} bilan suhbatingiz yakunlandi. \nYangi suhbatni boshlash uchun ${'suhbatdosh'.bold()} buyrug'ini bosing !`, startOption)
                        bot.sendMessage(chatId, `${item.name.bold()} bilan suhbatingiz yakunlandi. \nYangi suhbatni boshlash uchun ${'suhbatdosh'.bold()} buyrug'ini bosing !`, startOption)

                        return deletedUser, deletedUser2
                    }
                })
            }
        })
    }

    users.map(item => {
        if (item.user_id == chatId) {
            const first_text = msg.text?.split('')[0]

            if (item.connected != 0 && first_text != '/') {
                if (msg.text) {
                    bot.sendMessage(item.connected, `${message}`); 

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
            if (Number(item.connected) < 100 && item.is_active == true && msg.text != '/start' && msg.text != '/suhbatdosh') {
                bot.sendMessage(chatId, `Sizga suhbatdosh qidiryapma-a-a-a-n !!!!!`)
            }
        }

        if (item.user_id != chatId && msg.text != '/suhbatdosh' && msg.text != '/start' && item.connected == 0) {
            bot.sendMessage(chatId, `Suhbatdosh qidirish uchun /suhbatdosh buyrug'ini bosing !`)
        }
    })
    console.log(msg)
});

app.listen(process.env.PORT || 5000, async () => {
    console.log('🚀 app running on port', process.env.PORT || 5000)
})  