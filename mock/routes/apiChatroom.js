const express = require('express')
const router = express.Router()
const faker = require('faker')
const { genDatas, padStartWithZero, convertDateToFormatString } = require('../utils/responseHelper')

const emojiOrigin = ("😀 😃 😄 😁 😆 😅 😂 🤣 🥲 ☺️ 😊 😇 🙂 🙃 😉 😌 😍 🥰 😘 😗 😙 😚 😋 😛 😝 😜 🤪 🤨 🧐 🤓 😎 🥸 🤩 🥳 😏 😒 😞 😔 😟 😕 🙁 ☹️ 😣 😖 😫 😩 🥺 😢 😭 😤 😠 😡 🤬 🤯 😳 🥵 🥶 😱 😨 😰 😥 😓 🤗 🤔 🤭 🤫 🤥 😶 😐 😑 😬 🙄 😯 😦 😧 😮 😲 🥱 😴 🤤 😪 😵 🤐 🥴 🤢 🤮 🤧 😷 🤒 🤕 🤑 🤠 😈 👿 👹 👺 🤡 💩 👻 💀 ☠️ 👽 👾 🤖 🎃 😺 😸 😹 😻 😼 😽 🙀 😿 😾")

const emojiList = [{"emoji": "🙌", "name": "raising hands", "shortname": ":raised_hands:", "unicode": "1f64c", "html": "&#128588;", "category": "People & Body (hands)", "order": "1242"},
{"emoji": "🙈", "name": "see-no-evil monkey", "shortname": ":see_no_evil:", "unicode": "1f648", "html": "&#128584;", "category": "Smileys & Emotion (monkey-face)", "order": "96"},
{"emoji": "😢", "name": "crying face", "shortname": ":cry:", "unicode": "1f622", "html": "&#128546;", "category": "Smileys & Emotion (face-concerned)", "order": "54"},
{"emoji": "😎", "name": "smiling face with sunglasses", "shortname": ":sunglasses:", "unicode": "1f60e", "html": "&#128526;", "category": "Smileys & Emotion (face-glasses)", "order": "12"},
];

const messages = () => genDatas(20,()=>{
    const isHeart = faker.datatype.boolean();
    return {
        username:faker.internet.userName(),
    message:isHeart?"❤️":faker.lorem.sentence(),
    date:faker.date.past().getTime(),
    timeHint:faker.datatype.boolean(),
    reply:null,
    id:faker.datatype.number(),
    heart:isHeart,
    reaction:  genDatas(faker.datatype.number(3),()=>emojiList[faker.datatype.number(emojiList.length-1)]).map(ele => {return {...ele,from:faker.name.findName()}})
    }
});

const members = (size) => genDatas(size,()=>{
    return {
        username:faker.name.findName(),
        avatar:faker.image.avatar()
    }
});

const data = genDatas(20,()=>{
const isGroup = faker.datatype.boolean();
const size = isGroup?faker.datatype.number(6)+2:1;
const memberList = members(size);
const pic = faker.image.cats()
    return {
        id:faker.datatype.number(),
        title:isGroup?faker.name.jobTitle():memberList[0].username,
        roomPhoto:isGroup?pic:memberList[0].avatar,
        latestMessage:faker.lorem.sentence(),
        lastActiveDate:faker.date.past(),
        messages:messages(),
        read:faker.datatype.boolean(),
        loginStatus:faker.datatype.boolean(),
        group:isGroup,
        members:memberList,
        createdDate:faker.date.past().toJSON()
      }
})
router.get('/Chatroom', function (req, res) {
  res.json(data)
})

module.exports = router
