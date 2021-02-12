function verifyDateFormat(date, dateStr) {
   return (date.toDateString() !== "Invalid Date") && (dateStr.length === 19)
}

module.exports.verifyDateFormat = verifyDateFormat