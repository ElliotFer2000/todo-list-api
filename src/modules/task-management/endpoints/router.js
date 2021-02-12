const router = require("express").Router()
const ToDo = require("../business/models/ToDo")
const TaskList = require("../business/models/TaskList")
const jwt = require('jsonwebtoken')

const {
    verifyDateFormat
} = require("../../../helpers/date")

const {
    validateToDoTitle,
    validateDueDate
} = require("../business/task-management")

function taskManagementRouting(
    todoRepository
) {
    function verifyAuth(req, resp, next) {
        const token = req.headers['authorization'].replace("Bearer", "").trim()

        if (!token) {
            resp.status(401).json({
                message: 'There is no access token to access the resource'
            })
        } else {
            try {
                const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
                req.body.decodedToken = decodedToken
                next()
            } catch (e) {

                resp.status(401).json({
                    message: e.message
                })
            }
        }
    }

    router.post("/add-todo", function verifyRequestFormat(req, resp, next) {

            const todo = req.body

            if (!(typeof todo === "object")) {
                resp.status(400).json({
                    error: 'There is no body in the request'
                })
            } else {

                if ((!todo.title) || (!todo.idTaskList) || (!todo.dueDate)) {
                    resp.status(400).json({
                        message: 'Missing JSON properties'
                    })

                } else {
                    next()
                }
            }

        },
        verifyAuth,
        async function verifyTitleExistence(req, resp, next) {
                const res = await todoRepository.findToDo(new ToDo(req.body.title), new TaskList(null, null, req.body.decodedToken.userId, null, req.body.idTaskList))

                if (!res) {
                    next()
                } else {
                    resp.status(401).json({
                        message: 'A todo item with the title provided already exist'
                    })
                }
            },
            async function addToDo(req, resp) {
                const {
                    title,
                    idTaskList,
                    dueDate
                } = req.body
                console.log(dueDate)
                if (validateToDoTitle(new ToDo(title, idTaskList, dueDate)) && verifyDateFormat(new Date(dueDate), dueDate) && validateDueDate(dueDate)) {
                    const result = await todoRepository.insertToDo(idTaskList, new ToDo(title, false, dueDate))
                    result ? resp.status(200).json({
                        message: 'Added'
                    }) : resp.status(500).json({
                        message: 'Server error, the todo was not inserted, try again'
                    })
                } else {
                    resp.status(400).json({
                        message: 'ToDo title or date format or dueDate are invalid, dueDate format must be dd-mm-yyyyThh:mm:ss and be equal or greater than today'
                    })
                }
            })

    router.post("/create-todo-list", function verifyRequestFormat(req, resp, next) {
            const listData = req.body
            if ((!listData.title) && (!listData.creationDate)) {
                resp.status(400).json({
                    error: 'Missing JSON properties'
                })
            } else {
                next()
            }
        },
        verifyAuth,
        async function saveToDoList(req, resp) {
            const {
                title,
                creationDate,
                decodedToken
            } = req.body
            const result = await todoRepository.createToDoList(new TaskList(title, creationDate, decodedToken.userId, []))

            result ? resp.status(200).json({
                message: 'ToDo List added'
            }) : resp.status('500').json({
                message: 'Server error, the todo was not inserted, try again'
            })
        })

    router.get("/get-todos", verifyAuth,
        async function getToDos(req, resp) {
            const todos = await todoRepository.readToDos(req.body.decodedToken.userId)

            resp.json(todos)
        })

    router.put("/modify-todo-item", async function verifyStateAndRequestFormat(req, resp, next) {
            const todoData = req.body

            if ((!(typeof todoData.state === "number")) && (!todoData.title) && (!todoData.idTaskList)) {
                resp.status(400).json({
                    error: 'Missing JSON properties'
                })
            } else {
                if(todoData.state === 0 || todoData.state === 1 || todoData.state === 2){
                    next()
                }else{
                    resp.status(400).json({
                        message: 'Write either 0 to mark a todo as unfinished, 1 to mark a todo as finished and 2 to make a todo untrackable'
                    })
                }
                
            }
        },
        verifyAuth,
        
        async function updateToDo(req, resp) {
            const result = await todoRepository.updateToDo(req.body.decodedToken.userId, new ToDo(req.body.title, req.body.state), req.body.idTaskList)

            result.modifiedCount ? resp.status(200).json({
                message: 'State Updated'
            }) : resp.status('500').json({
                message: 'The update did not happen, try again, check if the title exists'
            })
        })


    return router
}


module.exports = taskManagementRouting