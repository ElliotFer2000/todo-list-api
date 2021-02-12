const router = require("express").Router()
const Event = require("../bussines/models/Event")
const {validateDueDate} = require("../bussines/agenda")
const {verifyDateFormat} = require("../../../helpers/date")
const jwt = require('jsonwebtoken')


function agendaRouting(
    agendaRepository
) {
    function verifyAuth(req, resp, next) {
        
        if(req.headers['authorization']){
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
        }else{
          resp.status(401).json({
              message: 'You must to include an authorization header with [Bearer <access_token>] as the content'
          })  
        }

    }

    router.post("/create-event", function verifyRequestFormat(req, resp, next) {
            const eventData = req.body
            if ((!eventData.title) && (!eventData.date) && (!eventData.description)) {
                resp.status(400).json({
                    error: 'Missing JSON properties'
                })
            } else {
                next()
            }
        },
        verifyAuth,
        function verifyEventDate(req,resp,next) {
            if(verifyDateFormat(new Date(req.body.date),req.body.date) && validateDueDate(req.body.date)){
               next()
            }else{
                resp.status(400).json({
                    message: 'Remember to put the date of the event in the <yyyy-mm-ddThh:mm:ss> format, the date must be greater or equal than today'
                })
            }
        },
        async function saveEvent(req, resp) {
            const {
                title,
                description,
                date,
                decodedToken
            } = req.body
            const result = await agendaRepository.insertEvent(new Event(date, title, description, decodedToken.userId, null))

            result ? resp.status(200).json({
                message: 'Event added'
            }) : resp.status('500').json({
                message: 'Server error, the event was not inserted, try again'
            })
        })

    router.get("/get-events",verifyAuth,
        async function getToDos(req, resp) {
            const events = await agendaRepository.readEvents(req.body.decodedToken.userId)

            resp.json(events)
    })




    return router
}


module.exports = agendaRouting