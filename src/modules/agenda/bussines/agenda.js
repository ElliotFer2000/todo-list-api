function validateDueDate(dateTime) {
    const mills = Date.now()
    const sourceDate = new Date(dateTime)
    const sourceMills = sourceDate.getTime()

    return mills < sourceMills
}

module.exports.validateDueDate = validateDueDate