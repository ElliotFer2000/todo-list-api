function Event(date,title,description,userOwner,_id) {
    this._id = _id
    this.date = date
    this.title = title
    this.description = description
    this.userOwner = userOwner
}

module.exports = Event