const {
    ObjectId
} = require("mongodb")

function usersRepository(database) {

    return Object.freeze({
        insertUser,
        findUser
    })

    async function findUser(userName) {
        try {
            console.log(userName)
            const result = await database.collection("users").findOne({
                userName
            })
            console.log("Result user search")
            console.log(result)
            return result
        } catch (e) {
            console.log(e)
        }
    }

    async function insertUser({
        userName,
        passWord
    }) {
        try {
            const result = await database.collection("users").insertOne({
                userName,
                passWord
            })
            console.log("Result insert")
            console.log(result)
            return result
        } catch (e) {
            console.log(e)
            return e
        }
    }
}

module.exports = usersRepository