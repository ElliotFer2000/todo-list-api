const bcrypt = require("bcrypt")

function getHash(string) {
    return bcrypt.hash(string,10)
}

module.exports = getHash