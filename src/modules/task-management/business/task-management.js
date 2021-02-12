function validateToDoTitle(todo) {
    return todo.title ? true : false
}

function validateDueDate(dateTime) {
    const mills = Date.now()
    const sourceDate = new Date(dateTime)
    const sourceMills = sourceDate.getTime()

    return mills < sourceMills
}

module.exports.validateToDoTitle = validateToDoTitle
module.exports.validateDueDate = validateDueDate