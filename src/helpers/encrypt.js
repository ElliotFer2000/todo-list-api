const bcrypt = require("bcrypt")

function getHash(string) {
    return bcrypt.hash(string, 10)
}

function compareHashes(str,encrypted) {
    return bcrypt.compare(str,encrypted)
}

module.exports.getHash = getHash
module.exports.compareHashes = compareHashes