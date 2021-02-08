const jwt = require('jsonwebtoken');

function User(userName, passWord) {
    this.userName = userName
    this.passWord = passWord
}

module.exports = User