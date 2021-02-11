function TaskList(title,creationDate,userOwner,taskList){
    this.userOwner = userOwner
    this.title = title
    this.creationDate = creationDate
    this.taskList = taskList
}

module.exports = TaskList