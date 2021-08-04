// 所有常數設定
// production 載入此設定為基礎，再進行覆寫
const constant = {
  // apiUrl: 'https://60d9c7045f7bf10017547741.mockapi.io/api/v1',
  apiUrl:"http://localhost:9999",
  giphyApiUrl:"https://api.giphy.com/v1",
  mode: 'development',
  
}
const  emojiList = [
  { emoji: '❤️', name: 'red heart', shortname: ':heart:', unicode: '2764', html: '&#10084;', category: 'Smileys & Emotion (emotion)', order: '1286' },
  {
    emoji: '😂',
    name: 'face with tears of joy',
    shortname: ':joy:',
    unicode: '1f602',
    html: '&#128514;',
    category: 'Smileys & Emotion (face-smiling)',
    order: '3'
  },
  {
    emoji: '😢',
    name: 'crying face',
    shortname: ':cry:',
    unicode: '1f622',
    html: '&#128546;',
    category: 'Smileys & Emotion (face-concerned)',
    order: '54'
  },
  {
    emoji: '😮',
    name: 'face with open mouth',
    shortname: ':open_mouth:',
    unicode: '1f62e',
    html: '&#128558;',
    category: 'Smileys & Emotion (face-concerned)',
    order: '29'
  },
  { emoji: '🔥', name: 'fire', shortname: ':fire:', unicode: '1f525', html: '&#128293;', category: 'Travel & Places (sky & weather)', order: '1753' },
  {
    emoji: '👍',
    name: 'thumbs up',
    shortname: ':thumbsup:',
    unicode: '1f44d',
    html: '&#128077;',
    category: 'People & Body (hand-fingers-closed)',
    order: '1176'
  }
]

export {emojiList};
export default constant;
