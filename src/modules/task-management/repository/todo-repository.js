const {
    ObjectId
} = require("mongodb")

function taskManagementRepository(database) {

    return Object.freeze({
        insertToDo,
        readTodos,
        createToDoList
    })

    async function createToDoList({
        title,
        creationDate,
        userOwner
    }) {
        try {
            const result = await database.collection("task_list").insertOne({
                title,
                creationDate,
                userOwner
            })
        } catch (e) {
            console.log(e)
            return e
        }
    }

    async function insertToDo(idTaskList, todo) {

        try {
            const result = await database.collection("tasks").updateOne({
                _id: ObjectId(idTaskList)
            }, {
                $push: {
                    taskList: todo
                }
            })
            console.log("resultado: " + result)
            return result
        } catch (e) {
            console.log(e)
            return e
        }
    }

    async function readTodos() {
        return []
    }
}

module.exports = taskManagementRepository