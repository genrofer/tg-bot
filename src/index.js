require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api');
const express = require('express')
const mongoose = require("mongoose")
const app = express()

app.use(express.json())

const { mainOption } = require("./modules/Options")

const FirstSection = require("./modules/FirstSection")
const SuhbatMsg = require("./modules/SuhbatMsg")
const SuhbatAction = require("./modules/SuhbatAction")
const RoomAction = require("./modules/RoomAction")

const User = require("./mongo/User")
const AllUsers = require("./mongo/AllUsers")
const Room = require("./mongo/Room")

mongoose
    .connect('mongodb+srv://Muzaffar:Muzaffarbek04@telegrambot.nfdozec.mongodb.net/users?retryWrites=true&w=majority')
    .then(() => console.log('Connected'))

app.get("/", async (req, res) => {
    const users = await User.find({})
    res.send(users)
})

const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.on('callback_query', async (callbackQuery) => {
    const action = callbackQuery.data;
    const msg = callbackQuery.message;
    const chatId = msg.chat.id;
    var name = msg.chat.first_name;
    const username = msg.chat.username;
    const users = await User.find({})
    const all_users = await AllUsers.find({})
    const userLength = users.length

    var regExp = /[a-zA-Z]/g;
    if (regExp.test(name)) {
        let letterMessage = name.replace(/[^a-zA-Z]/gm, "")
        var name = letterMessage
    } else {
        var name = 'undefined'
    }

    SuhbatAction.SuhbatAction(action, msg, chatId, name, username, users, userLength, User, Room)

    RoomAction.RoomAction(action, msg, chatId, Room, name)

    RoomAction.RoomLang(msg, Room, action)

    RoomAction.RoomCount(msg, Room, action)

    FirstSection.SelectLang(action, msg, chatId, name, username, AllUsers, all_users)
});


bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const users = await User.find({})
    var name = msg.chat.first_name;

    var regExp = /[a-zA-Z]/g;
    if (regExp.test(name)) {
        let letterMessage = name.replace(/[^a-zA-Z]/gm, "")
        var name = letterMessage
    } else {
        var name = 'Text User'
    }

    var options = {
        parse_mode: "Markdown",
        disable_web_page_preview: true,
        reply_markup: JSON.stringify({
            keyboard: [
                [{
                    text: 'Main 🏠',
                }, {
                    text: '🇫🇷 Français',
                }]
            ],
            resize_keyboard: true
        })
    };

    // if (!msg.text == 'Main 🏠') {
        // bot.sendMessage(msg.chat.id, "Please choose your language", options);
    // }

    FirstSection.Start(msg, chatId, Room)

    FirstSection.Main(msg, chatId, name, Room, users, User)

    RoomAction.RoomMsg(msg, Room, name)

    SuhbatMsg.Chatting(msg, users, chatId, mainOption, name)
});

 
app.listen(process.env.PORT || 5000, async () => {
    console.log('🚀 app running on port', process.env.PORT || 5000)
})


// const user = new User({
//     user_id: chatId,
//     name: name,
//     username: username ? username : 'undefined',
//     is_active: false,
//     connected: changeId.user_id
// })
// try { await user.save() } catch (error) { console.log(error) }