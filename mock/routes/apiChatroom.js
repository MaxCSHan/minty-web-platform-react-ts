const express = require('express')
const router = express.Router()
const faker = require('faker')
const { genDatas, padStartWithZero, convertDateToFormatString } = require('../utils/responseHelper')

const emojiOrigin = ("😀 😃 😄 😁 😆 😅 😂 🤣 🥲 ☺️ 😊 😇 🙂 🙃 😉 😌 😍 🥰 😘 😗 😙 😚 😋 😛 😝 😜 🤪 🤨 🧐 🤓 😎 🥸 🤩 🥳 😏 😒 😞 😔 😟 😕 🙁 ☹️ 😣 😖 😫 😩 🥺 😢 😭 😤 😠 😡 🤬 🤯 😳 🥵 🥶 😱 😨 😰 😥 😓 🤗 🤔 🤭 🤫 🤥 😶 😐 😑 😬 🙄 😯 😦 😧 😮 😲 🥱 😴 🤤 😪 😵 🤐 🥴 🤢 🤮 🤧 😷 🤒 🤕 🤑 🤠 😈 👿 👹 👺 🤡 💩 👻 💀 ☠️ 👽 👾 🤖 🎃 😺 😸 😹 😻 😼 😽 🙀 😿 😾")

const emojiList = [
    {"emoji": "❤️", "name": "red heart", "shortname": ":heart:", "unicode": "2764", "html": "&#10084;", "category": "Smileys & Emotion (emotion)", "order": "1286"},
    {"emoji": "😂", "name": "face with tears of joy", "shortname": ":joy:", "unicode": "1f602", "html": "&#128514;", "category": "Smileys & Emotion (face-smiling)", "order": "3"},
    {"emoji": "😢", "name": "crying face", "shortname": ":cry:", "unicode": "1f622", "html": "&#128546;", "category": "Smileys & Emotion (face-concerned)", "order": "54"},
    {"emoji": "😮", "name": "face with open mouth", "shortname": ":open_mouth:", "unicode": "1f62e", "html": "&#128558;", "category": "Smileys & Emotion (face-concerned)", "order": "29"},
    {"emoji": "🔥", "name": "fire", "shortname": ":fire:", "unicode": "1f525", "html": "&#128293;", "category": "Travel & Places (sky & weather)", "order": "1753"},
    {"emoji": "👍", "name": "thumbs up", "shortname": ":thumbsup:", "unicode": "1f44d", "html": "&#128077;", "category": "People & Body (hand-fingers-closed)", "order": "1176"},
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
    reaction:  genDatas(faker.datatype.number(3),()=>({ from:faker.internet.userName(),emoji:emojiList[faker.datatype.number(emojiList.length-1)]}))
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
