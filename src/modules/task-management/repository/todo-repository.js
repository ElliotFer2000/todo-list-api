const {
    ObjectId
} = require("mongodb")

function taskManagementRepository(database) {
   
    return Object.freeze({
        insertToDo,
        readTodos,
    })

    async function insertToDo(idTaskList,todo) {
       
        try {
            result = await database.collection("tasks").updateOne({
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

module.exports.taskManagementRepository = taskManagementRepository