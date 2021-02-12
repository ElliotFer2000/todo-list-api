const {
    ObjectId
} = require("mongodb")

function agendaRepository(database) {

    return Object.freeze({
        insertEvent,
        readEvents
    })

    async function insertEvent(event) {
        try {
            const result = await database.collection("events").insertOne(event)
            return result
        } catch (e) {
            console.log(e)
            return e
        }
    }


    async function readEvents(userOwner) {

        try {
            const events = []
            const result = await database.collection("events").find({
                "userOwner": userOwner
            })

            await result.forEach(element => {
                events.push(element)
            });

            return events
        } catch (e) {
            console.log(e)
            return e
        }
    }
}

module.exports = agendaRepository