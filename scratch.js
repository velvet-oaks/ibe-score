// const oldDataRaw = require('./src/app/data/players_and_events.json');
const fs = require('fs')
// const oldData = oldDataRaw.playerdb.root.item
// //console.log(oldData)
// var newArray = new Array();
// for (idx in oldData) {

//   if (oldData[idx]._type == "player"){
//     oldData[idx]._id = genID()
//     newArray.push(oldData[idx])
//   }
// }
// const newData = JSON.stringify(newArray);
//  fs.writeFileSync('players.json',newData,'utf-8')
// function genID() {
//   const timeStamp = Date.now();
//   let str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
//   let Id = '';
//   for (let i = 0; i < 7; i++) {
//       let rom = Math.floor(1 +(str.length -1)*Math.random());
//       Id += str.charAt(rom);
//   }
//   Id += timeStamp.toString();
//   return Id;
// }

// const bulky = require('./src/app/data/events_new.json');
// var inside = bulky[0].playerConfig.players;
// var newA = [];

// for (idx in inside){
//   newA.push(inside[idx].ns[0])
//   newA.push(inside[idx].ns[1])
//   newA.push(inside[idx].ew[0])
//   newA.push(inside[idx].ew[1])
// }
// console.log(newA)



// const user = require('./src/app/data/players.json');
// const bcrypt = require('bcrypt');
// const saltRounds = 10;
// const newUsers = new Array();
// for (idx in user){

//   var obj = {
//     full_name:user[idx].name,
//     user_name:user[idx].name.split(" ").join("_"),
//     _id:user[idx]._id,
//     email:user[idx].name.split(" ")[0]+"@testemail.com",
//     password:"$2a$10$2KRja5NM0FrG26y0gzTRiOcf1qT6FJCoQrywFKpYUkeHDN0jlkQbu",
//     userData: {
//       lastPlay:user[idx].lastplay,
//       addDate:user[idx]._adddate,
//       pp:user[idx].pp,
//     }

//   };
//   newUsers.push(obj)
// }
//   bcrypt.genSalt(saltRounds, function(err, salt) {
//     bcrypt.hash(user[idx].name.split(" ")[0], salt, function(err, hash) {
//       var obj = {
//         full_name:user[idx].name,
//         user_name:user[idx].name.split(" ").join("_"),
//         email:user[idx].name.split(" ")[0]+"@testemail.com",
//         password:hash,
//         userData: {
//           lastPlay:user[idx].lastplay,
//           addDate:user[idx]._adddate,
//           pp:user[idx].pp,
//         }
//       };
//
//       //console.log(obj)
//     });
// });
// const newData = JSON.stringify(newUsers);
// fs.writeFileSync('users.json',newData,'utf-8')
// console.log(newUsers)

const moment = require("moment")
const users = require('./src/app/data/users.json');
for (i in users){
  if (users[i].userData.lastPlayed){
    var originalDate = users[i].userData.lastPlayed;
    var originalDate2 = users[i].userData.addDate;
  var splitDate = originalDate.split("/")
  var splitDate2 = originalDate2.split("/")
  const date = moment(splitDate[2], "YY");
  const year = date.format("YYYY")
  const date2 = moment(splitDate2[2], "YY");
  const year2 = date.format("YYYY")
  splitDate[2] = year;
  splitDate2[2] = year2;
  var myDate = splitDate
  var myDate2 = splitDate2
  var someDate = new Date( myDate[2], myDate[1] - 1, myDate[0]);
  var someDate2 = new Date( myDate2[2], myDate2[1] - 1, myDate2[0]);
  users[i].userData.lastPlayed = someDate.getTime();
  users[i].userData.addDate = someDate2.getTime();
 console.log(someDate.getTime())

  }

};
const newData = JSON.stringify(users)
fs.writeFileSync('users.json',newData)
