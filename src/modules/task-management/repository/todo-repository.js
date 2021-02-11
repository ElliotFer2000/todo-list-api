const {
    ObjectId
} = require("mongodb")

function taskManagementRepository(database) {

    return Object.freeze({
        insertToDo,
        readToDos,
        createToDoList,
        updateToDo,
        findToDo
    })

    async function createToDoList(taskList) {
        try {
            const result = await database.collection("tasks").insertOne(taskList)
            return result
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
            return result
        } catch (e) {
            console.log(e)
            return e
        }
    }

    async function updateToDo(userOwner, todo) {
        try {
            const result = await database.collection("tasks").updateOne({
                "userOwner": userOwner
            }, {
                $set: {
                    "taskList.$[element].state": todo.state
                }
            }, {
                arrayFilters: [{
                    "element.title": {
                        $eq: todo.title
                    },
                }],
                multi: true
            })
            return result
        } catch (e) {
            console.log(e)
            return e
        }
    }

    async function findToDo(todo,taskList) {

        const result = await database.collection("tasks").countDocuments({
            "userOwner": taskList.userOwner,
            "taskList.title": todo.title
        })
        
        return result
    }

    async function readToDos(userOwner) {

        try {
            const todos = []
            const result = await database.collection("tasks").find({
                "userOwner": userOwner

            })

            await result.forEach(element => {
                element.taskList = element.taskList.filter((value, index, array) => {
                    return value.state !== 0
                })
                todos.push(element)
            });

            return todos
        } catch (e) {
            console.log(e)
            return e
        }
    }
}

module.exports = taskManagementRepository