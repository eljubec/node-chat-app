const moment = require('moment');

// let date = new Date();

// console.log(date.getMonth());

// let date = moment();
// console.log(date.format('MMM Do, YYYY'));

//10:35am
//6:01 am


let createdAt = 567910976556765
let date = moment(createdAt);
console.log(date.format('LT'))