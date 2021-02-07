const express = require("express")
const bodyParser = require("body-parser")
const expressApp = express()
const taskManagementRouting  = require("./modules/task-management/endpoints/router")
const {taskManagementRepository} = require("./modules/task-management/repository/todo-repository")
const {makeDb} = require("./db/index")

console.log(taskManagementRouting)

console.log(__dirname)
require("dotenv").config({path: `${__dirname}/../.env`})



async function startUpApp(){
    const port = process.env.SERVER_PORT || 7500

    const db = await makeDb()

    expressApp.use(bodyParser.json())
    expressApp.use("/task-management/",taskManagementRouting(taskManagementRepository(db)))

    expressApp.listen(port,'localhost',()=>{
        console.log(`Server listening on port ${port}`)
    })

}





startUpApp()

