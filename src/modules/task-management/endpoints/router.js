const router = require("express").Router()
const ToDo = require("../business/models/ToDo")
const jwt = require('jsonwebtoken')

const {
    validateToDo
} = require("../business/task-management")

function taskManagementRouting(
    todoRepository
) {
    function verifyAuth(req, resp, next) {
        if (!req.body.accessToken) {
            resp.status(401).json({
                message: 'There is no access token to access the resource'
            })
        } else {
            try {
                const res = jwt.verify(req.body.accessToken, process.env.JWT_SECRET)
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

                if ((!todo.title) || (!todo.idTaskList)) {
                    resp.status(400).json({
                        message: 'Missing JSON properties'
                    })

                } else {
                    next()
                }
            }

        },
        verifyAuth,
        async function addToDo(req, resp, next) {
            const {
                title,
                idTaskList
            } = req.body

            if (validateToDo(new ToDo(title, idTaskList))) {
                const result = await todoRepository.insertToDo(idTaskList, new ToDo(title, false))
                result ? resp.status(200).json({
                    message: 'Added'
                }) : resp.status('500').json({
                    message: 'Server error, the todo was not inserted, try again'
                })
            }
        })

    router.post("/create-todo-list", function verifyRequestFormat(req, resp, next) {
            const listData = req.body
            if ((!listData.title) && (!listData.creationDate) && (!listData.idUser)) {
                req.status(400).json({
                    error: 'Missing JSON properties'
                })
            } else {
                next()
            }
        },
        verifyAuth)

    router.get("/get-todos", async function getToDos(req, resp) {

    })

    router.put("/update-state", async function update(req, resp) {

    })

    return router
}


module.exports = taskManagementRouting