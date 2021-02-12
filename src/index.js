const bodyParser = require("body-parser")
const expressApp = require("express")()
const {authRepository,authRouting} = require("./modules/auth/index")
const {todoRepository,todoRouting} = require("./modules/task-management/index")
const {agendaRepository,agendaRouting} = require("./modules/agenda/index")
const {makeDb} = require("./db/index")

require("dotenv").config({path: `${__dirname}/../.env`})

async function startUpApp(){
    const port = process.env.SERVER_PORT || 7500

    const db = await makeDb()

    expressApp.use(bodyParser.json())
    expressApp.use("/task-management/",todoRouting(todoRepository(db)))
    expressApp.use("/auth/",authRouting(authRepository(db)))
    expressApp.use("/agenda/",agendaRouting(agendaRepository(db)))
    expressApp.listen(port,'localhost',()=>{
        console.log(`Server listening on port ${port}`)
    })

}





startUpApp()
