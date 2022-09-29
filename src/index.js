require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api');
const express = require('express')
const model = require("./modules/model")
const fs = require('fs')
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

    // const video = (await bot.getFileLink(msg.video?.file_id)).toString();
    // const sticker = (await bot.getFileLink(msg.sticker?.file_id)).toString();
    // const gif = (await bot.getFileLink(msg.animation?.file_id)).toString();
    // const audio = (await bot.getFileLink(msg.audio?.file_id)).toString();

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

            if (item.connected != 0 && msg.text != '/suhbatdosh' && msg.text != '/start' && msg.text != '/stop') {
                const connectedUser = users.find(user => user.user_id == item.connected)
                if (msg.text) {
                    bot.sendMessage(item.connected, `${message}`);

                } else if (msg.photo) {
                    async function downloadImage() {
                        let img = (await bot.getFileLink(msg.photo[2] ? msg?.photo[2]?.file_id : msg?.photo[1]?.file_id)).toString();
                        const url = img ? img : ''
                        const paths = path.resolve(__dirname, 'images', `${name}_${connectedUser.name}__${hour}_${minute}__${day}_${month}_${year}___${now}.jpg`)
                        const writer = fs.createWriteStream(paths)

                        const response = await axios({
                            url,
                            method: 'GET',
                            responseType: 'stream'
                        })
                        response.data.pipe(writer)
                        return new Promise((resolve, reject) => {
                            writer.on('finish', resolve)
                            writer.on('error', reject)
                        })
                    }
                    downloadImage()

                    setTimeout(() => {
                        bot.sendPhoto(item.connected, `${img}`)
                    }, 1000);

                } else if (msg.video) {
                    bot.sendVideo(item.connected, `${video}`)
                } else if (msg.sticker) {
                    bot.sendSticker(item.connected, `${sticker}`)
                } else if (msg.animation) {
                    bot.sendAnimation(item.connected, `${gif}`)
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
});     

app.listen(process.env.PORT || 5000, async () => {
    console.log('🚀 app running on port', process.env.PORT || 5000)
})  