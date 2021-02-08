function validateUserAndPassword({userName,passWord}) {
    return userName.length > 4 && passWord.length > 4 ? true : false
}

module.exports.validateUserAndPassword = validateUserAndPassword