import Chatroom from "./component/chatroom";
import Chatlist from "./component/chatlist";
import { useState,useEffect } from "react";
import {loginUser} from "../../../services/authService"
import { Switch, Route,Redirect} from "react-router-dom";
import Starter from "./component/Starter";
const Chat = () => {

  const [myUsername,setMyUserName] = useState("");


  useEffect(()=>{
    setMyUserName(loginUser()?.username);

    //  const testGroup = JSON.parse('{"id":31732,"title":"Legacy Paradigm Supervisor","roomPhoto":"http://placeimg.com/640/480/cats","latestMessage":"Cum quasi ut ex.","lastActiveDate":"2021-04-22T15:05:26.308Z","messages":[{"username":"Cornelius_Legros24","message":"Molestias quis aperiam itaque.","date":1594010087355,"timeHint":true,"reply":null,"id":7740,"heart":false,"reaction":[]},{"username":"Anastacio.Hirthe80","message":"Quam et sint soluta porro et.","date":1600150206009,"timeHint":false,"reply":null,"id":98475,"heart":false,"reaction":[{"from":"Roman.Weber","emoji":{"emoji":"👍","name":"thumbs up","shortname":":thumbsup:","unicode":"1f44d","html":"&#128077;","category":"People & Body (hand-fingers-closed)","order":"1176"}},{"from":"Marlee67","emoji":{"emoji":"😢","name":"crying face","shortname":":cry:","unicode":"1f622","html":"&#128546;","category":"Smileys & Emotion (face-concerned)","order":"54"}}]},{"username":"Carey68","message":"❤️","date":1607396487120,"timeHint":true,"reply":null,"id":70779,"heart":true,"reaction":[{"from":"Irwin_Herzog93","emoji":{"emoji":"😢","name":"crying face","shortname":":cry:","unicode":"1f622","html":"&#128546;","category":"Smileys & Emotion (face-concerned)","order":"54"}},{"from":"Garret98","emoji":{"emoji":"❤️","name":"red heart","shortname":":heart:","unicode":"2764","html":"&#10084;","category":"Smileys & Emotion (emotion)","order":"1286"}}]},{"username":"Providenci65","message":"❤️","date":1622164084211,"timeHint":true,"reply":null,"id":35749,"heart":true,"reaction":[{"from":"Earnestine_Ward23","emoji":{"emoji":"😂","name":"face with tears of joy","shortname":":joy:","unicode":"1f602","html":"&#128514;","category":"Smileys & Emotion (face-smiling)","order":"3"}},{"from":"Henry49","emoji":{"emoji":"🔥","name":"fire","shortname":":fire:","unicode":"1f525","html":"&#128293;","category":"Travel & Places (sky & weather)","order":"1753"}},{"from":"Alysson81","emoji":{"emoji":"❤️","name":"red heart","shortname":":heart:","unicode":"2764","html":"&#10084;","category":"Smileys & Emotion (emotion)","order":"1286"}}]},{"username":"Immanuel_Abbott","message":"❤️","date":1598578004202,"timeHint":true,"reply":null,"id":40871,"heart":true,"reaction":[]},{"username":"Camden78","message":"❤️","date":1615800722519,"timeHint":true,"reply":null,"id":63194,"heart":true,"reaction":[{"from":"Cali41","emoji":{"emoji":"👍","name":"thumbs up","shortname":":thumbsup:","unicode":"1f44d","html":"&#128077;","category":"People & Body (hand-fingers-closed)","order":"1176"}}]},{"username":"Shea_Goodwin37","message":"Ab et facilis officiis necessitatibus aliquam dolorem similique fugit et.","date":1609532686580,"timeHint":false,"reply":null,"id":47097,"heart":false,"reaction":[]},{"username":"Jade.Smith","message":"❤️","date":1601644405809,"timeHint":false,"reply":null,"id":44863,"heart":true,"reaction":[{"from":"Harley.McCullough93","emoji":{"emoji":"😮","name":"face with open mouth","shortname":":open_mouth:","unicode":"1f62e","html":"&#128558;","category":"Smileys & Emotion (face-concerned)","order":"29"}},{"from":"Julia_Stiedemann15","emoji":{"emoji":"🔥","name":"fire","shortname":":fire:","unicode":"1f525","html":"&#128293;","category":"Travel & Places (sky & weather)","order":"1753"}}]},{"username":"Corine.Parisian76","message":"❤️","date":1598854140872,"timeHint":true,"reply":null,"id":83153,"heart":true,"reaction":[{"from":"Mattie6","emoji":{"emoji":"😂","name":"face with tears of joy","shortname":":joy:","unicode":"1f602","html":"&#128514;","category":"Smileys & Emotion (face-smiling)","order":"3"}}]},{"username":"Jesus35","message":"❤️","date":1624676710715,"timeHint":true,"reply":null,"id":54096,"heart":true,"reaction":[]},{"username":"Maximillia.Marks26","message":"❤️","date":1614273277561,"timeHint":false,"reply":null,"id":86341,"heart":true,"reaction":[{"from":"Vernice_Torp63","emoji":{"emoji":"👍","name":"thumbs up","shortname":":thumbsup:","unicode":"1f44d","html":"&#128077;","category":"People & Body (hand-fingers-closed)","order":"1176"}},{"from":"Aliyah44","emoji":{"emoji":"🔥","name":"fire","shortname":":fire:","unicode":"1f525","html":"&#128293;","category":"Travel & Places (sky & weather)","order":"1753"}}]},{"username":"Cloyd41","message":"❤️","date":1601133551616,"timeHint":false,"reply":null,"id":81042,"heart":true,"reaction":[{"from":"Fae_Koepp50","emoji":{"emoji":"👍","name":"thumbs up","shortname":":thumbsup:","unicode":"1f44d","html":"&#128077;","category":"People & Body (hand-fingers-closed)","order":"1176"}}]},{"username":"Kevon_Hayes","message":"❤️","date":1623266672472,"timeHint":true,"reply":null,"id":79236,"heart":true,"reaction":[]},{"username":"Minnie13","message":"❤️","date":1601199350794,"timeHint":true,"reply":null,"id":52262,"heart":true,"reaction":[{"from":"Gabrielle15","emoji":{"emoji":"😢","name":"crying face","shortname":":cry:","unicode":"1f622","html":"&#128546;","category":"Smileys & Emotion (face-concerned)","order":"54"}},{"from":"Celia69","emoji":{"emoji":"😂","name":"face with tears of joy","shortname":":joy:","unicode":"1f602","html":"&#128514;","category":"Smileys & Emotion (face-smiling)","order":"3"}},{"from":"Cameron_Cormier59","emoji":{"emoji":"👍","name":"thumbs up","shortname":":thumbsup:","unicode":"1f44d","html":"&#128077;","category":"People & Body (hand-fingers-closed)","order":"1176"}}]},{"username":"Juanita67","message":"❤️","date":1609779402848,"timeHint":true,"reply":null,"id":81576,"heart":true,"reaction":[{"from":"Maxine82","emoji":{"emoji":"👍","name":"thumbs up","shortname":":thumbsup:","unicode":"1f44d","html":"&#128077;","category":"People & Body (hand-fingers-closed)","order":"1176"}},{"from":"Abraham.Schultz","emoji":{"emoji":"👍","name":"thumbs up","shortname":":thumbsup:","unicode":"1f44d","html":"&#128077;","category":"People & Body (hand-fingers-closed)","order":"1176"}},{"from":"Stanley87","emoji":{"emoji":"❤️","name":"red heart","shortname":":heart:","unicode":"2764","html":"&#10084;","category":"Smileys & Emotion (emotion)","order":"1286"}}]},{"username":"Britney.Gaylord","message":"❤️","date":1620869950885,"timeHint":true,"reply":null,"id":33718,"heart":true,"reaction":[{"from":"Elmore34","emoji":{"emoji":"😂","name":"face with tears of joy","shortname":":joy:","unicode":"1f602","html":"&#128514;","category":"Smileys & Emotion (face-smiling)","order":"3"}}]},{"username":"Keira.Cartwright","message":"❤️","date":1605690296748,"timeHint":true,"reply":null,"id":38974,"heart":true,"reaction":[{"from":"Harmony.Fritsch43","emoji":{"emoji":"😮","name":"face with open mouth","shortname":":open_mouth:","unicode":"1f62e","html":"&#128558;","category":"Smileys & Emotion (face-concerned)","order":"29"}}]},{"username":"Boyd_Fahey","message":"❤️","date":1600223185640,"timeHint":true,"reply":null,"id":13599,"heart":true,"reaction":[]},{"username":"Charles.Gislason24","message":"Vel sed in quae vel error modi iste voluptatem repellendus.","date":1611697953805,"timeHint":false,"reply":null,"id":86052,"heart":false,"reaction":[{"from":"Lucas88","emoji":{"emoji":"❤️","name":"red heart","shortname":":heart:","unicode":"2764","html":"&#10084;","category":"Smileys & Emotion (emotion)","order":"1286"}},{"from":"Elmer.Bartoletti50","emoji":{"emoji":"🔥","name":"fire","shortname":":fire:","unicode":"1f525","html":"&#128293;","category":"Travel & Places (sky & weather)","order":"1753"}},{"from":"Alvina.McDermott69","emoji":{"emoji":"👍","name":"thumbs up","shortname":":thumbsup:","unicode":"1f44d","html":"&#128077;","category":"People & Body (hand-fingers-closed)","order":"1176"}}]},{"username":"Fleta42","message":"Expedita ad quis.","date":1612972862986,"timeHint":true,"reply":null,"id":99401,"heart":false,"reaction":[{"from":"Joseph.Kemmer","emoji":{"emoji":"🔥","name":"fire","shortname":":fire:","unicode":"1f525","html":"&#128293;","category":"Travel & Places (sky & weather)","order":"1753"}},{"from":"Nicklaus_Grimes38","emoji":{"emoji":"😂","name":"face with tears of joy","shortname":":joy:","unicode":"1f602","html":"&#128514;","category":"Smileys & Emotion (face-smiling)","order":"3"}}]}],"read":true,"loginStatus":true,"group":true,"members":[{"username":"Heidi Torp","avatar":"https://cdn.fakercloud.com/avatars/bagawarman_128.jpg"},{"username":"Joy Bogan","avatar":"https://cdn.fakercloud.com/avatars/kamal_chaneman_128.jpg"},{"username":"Pedro Jenkins","avatar":"https://cdn.fakercloud.com/avatars/madshensel_128.jpg"}],"createdDate":"2020-08-05T03:49:22.025Z"}') 
    //  const newRoom = chatRef.child("chatrooms").push();
    //  newRoom.set({...testGroup,reaction:[]});
    //  const newMess = chatRef.child("Messages").push();
    //  testGroup.messages.forEach((ele:any) => {
    //   const newMes = newMess.push();
    //   newMes.set(ele)
    //  })

  },[])


  return (
    <div className=" overflow-hidden flex h-screen  pt-14  w-screen 	justify-center  sm:items-center sm:bg-gray-100  transition duration-100 ease-in-out">
      <div className=" max-h-180 sm:h-95/100 sm:max-h-240 md:max-h-280  2xl:max-h-320 flex flex-col sm:flex sm:flex-row md:flex-row">
        <Chatlist   myUsername={myUsername}></Chatlist>
        <Switch>
          <Route exact path="/chat/inbox" component={Starter} />
          <Redirect exact from="/chat/room/" to="/chat/inbox" />
          <Redirect exact from="/chat/" to="/chat/inbox" />
          <Route exact path="/chat/room/:id" component={Chatroom} />
        </Switch>
        {/* <Chatroom roomSelected={selectedRoom} userSelected={selectedUser}  myUserName={myUsername}></Chatroom> */}
      </div>
    </div>
  );
};

export default Chat;
