const router = require("express").Router()
const ToDo = require("../business/models/task")
const {validateToDo} = require("../business/task-management")

function taskManagementRouting(
    todoRepository
) {
    console.log("Paco gento: " + todoRepository)
    router.post("/add-todo", function verifyRequestFormat(req, resp, next) {

        console.log("Here")
        const todo = req.body

        console.log(todo)

        if (!(typeof todo === "object")) {
            resp.status(400).json({
                error: 'There is no body in the request'
            })
        } else {
            
            if ((!todo.title) || (!todo.idTaskList)) {
                resp.status(400).json({
                    error: 'Missing JSON properties'
                })
                 
            }else{
                next()
            }
           
        }

    }, async function addToDo(req, resp, next) {
        const {
            title,
            idTaskList
        } = req.body

        if (validateToDo(new ToDo(title,idTaskList))) {

            const result = await todoRepository.insertToDo(idTaskList, new ToDo(title, false))

            result ? resp.status(200).json({
                message: 'Added'
            }) : resp.status('500').json({
                message: 'Server error, the todo was not inserted, try again'
            })
        }
    })

    router.get("/get-todos", async function getToDos(req, resp) {
       
    })

    router.put("/update-state", async function update(req, resp) {

    })

    return router
}


module.exports = taskManagementRouting