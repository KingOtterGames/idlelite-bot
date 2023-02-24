const commaNumber = require('comma-number')

const decimalDisplay = (num) => {
  return commaNumber(parseFloat(num).toFixed(2))
}

const wholeDisplay = (num) => {
  return commaNumber(parseFloat(num).toFixed(0))
}

module.exports = {
  decimalDisplay,
  wholeDisplay,
}
