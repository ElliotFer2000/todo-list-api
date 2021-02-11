function TaskList(title,creationDate,userOwner,taskList,_id){
    this.userOwner = userOwner
    this.title = title
    this.creationDate = creationDate
    this.taskList = taskList
    this._id = _id
}

module.exports = TaskList