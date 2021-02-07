const express = require("express")
const expressApp = express()

require("dotenv").config()

const port = process.env.SERVER_PORT || 9000

expressApp.listen(()=>{
    console.log(`Server listening on port ${port}`)
})