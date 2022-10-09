var option = {
     "parse_mode": "HTML"
};

var mainOption = {
     reply_markup: JSON.stringify({
          inline_keyboard: [
               [{ text: 'Suhbatdosh 🗣️', callback_data: 'suhbat' }, { text: 'Xona 🚪', callback_data: 'room' }],
          ],
     }),
     "parse_mode": "HTML"
};

var mainEngOption = {
     reply_markup: JSON.stringify({
          inline_keyboard: [
               [{ text: 'Conversation 🗣️', callback_data: 'suhbat' }, { text: 'Room 🚪', callback_data: 'room' }],
          ]
     }),
     "parse_mode": "HTML"
};

var mainRuOption = {
     reply_markup: JSON.stringify({
          inline_keyboard: [
               [{ text: 'Собеседник 🗣️', callback_data: 'suhbat' }, { text: 'Комната 🚪', callback_data: 'room' }],
          ]
     }),
     "parse_mode": "HTML"
};

const uzbekOption = {
     reply_markup: JSON.stringify({
          inline_keyboard: [
               [{ text: 'Qani ketdik 🚀', callback_data: 'gouzbek' }],
          ]
     }),
     "parse_mode": "HTML"
};

const englishOption = {
     reply_markup: JSON.stringify({
          inline_keyboard: [
               [{ text: `Let's start 🚀`, callback_data: 'goenglish' }],
          ]
     }),
     "parse_mode": "HTML"
};

const russianOption = {
     reply_markup: JSON.stringify({
          inline_keyboard: [
               [{ text: 'Давай начнем 🚀', callback_data: 'gorussian' }],
          ]
     }),
     "parse_mode": "HTML"
};

var langOption = {
     reply_markup: JSON.stringify({
          inline_keyboard: [
               [{ text: 'Uzbek 🇺🇿', callback_data: 'uzbek' }, { text: 'English 🇺🇸', callback_data: 'english' }, { text: 'Русский 🇷🇺', callback_data: 'russian' }],
          ]
     }),
     "parse_mode": "HTML"
};

var roomLang = {
     reply_markup: JSON.stringify({
          inline_keyboard: [
               [{ text: 'Uzbek 🇺🇿', callback_data: 'roomUzbek' }, { text: 'English 🇺🇸', callback_data: 'roomEnglish' }, { text: 'Русский 🇷🇺', callback_data: 'roomRussian' }],
          ]
     }),
     "parse_mode": "HTML"
};

var roomMemberCount = {
     reply_markup: JSON.stringify({
          inline_keyboard: [
               [{ text: '1', callback_data: '1member' }, { text: '2', callback_data: '2member' }, { text: '3', callback_data: '3member' }, { text: '4', callback_data: '4member' }, { text: '5', callback_data: '5member' }],
               [{ text: '6', callback_data: '6member' }, { text: '7', callback_data: '7member' }, { text: '8', callback_data: '8member' }, { text: '9', callback_data: '9member' }, { text: '10', callback_data: '10member' }],
          ]
     }),
     "parse_mode": "HTML"
};

var deleteRoom = {
     reply_markup: JSON.stringify({
          inline_keyboard: [
               [{ text: 'Xa ✅', callback_data: 'deletemyroom' }, { text: `Yo'q ❌`, callback_data: 'dontdeletemyroom' }],
          ]
     }),
     "parse_mode": "HTML"
}

var roomConfirm = {
     reply_markup: JSON.stringify({
          inline_keyboard: [
               [{ text: 'Xa ✅', callback_data: 'confirm' }, { text: `Yo'q ❌`, callback_data: 'dontconfirm' }],
          ]
     }),
     "parse_mode": "HTML"
}

var exitRoom = {
     reply_markup: JSON.stringify({
          inline_keyboard: [
               [{ text: 'Xa ✅', callback_data: 'exitRoom' }, { text: `Yo'q ❌`, callback_data: 'dontExit' }],
          ]
     }),
     "parse_mode": "HTML"
}


module.exports = {
     mainOption,
     mainEngOption,
     mainRuOption,
     uzbekOption,
     englishOption,
     russianOption,
     option,
     langOption,
     roomLang,
     roomMemberCount,
     deleteRoom,
     roomConfirm,
     exitRoom
}