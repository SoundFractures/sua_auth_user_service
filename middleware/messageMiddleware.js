const { produceMessage } = require('../services/produceMessage')

async function messageMiddleware(req, res, next) {
  const { v4: uuidv4 } = require('uuid')
  var today = new Date()
  var dd = String(today.getDate()).padStart(2, '0')
  var mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
  var yyyy = today.getFullYear()
  date = yyyy + '-' + mm + '-' + dd
  time = today.toLocaleTimeString()
  await res.on('finish', function () {
    let cID = 0
    if (req.get('x-corelation-id')) cID = req.get('x-corelation-id')
    else cID = 'TPAUS-' + uuidv4()
    const message = `${date} ${time} ${res.messageType} ${req.originalUrl} Correlation: ${cID} [AuthUserService]: ${res.message}`
    console.log(message)
    produceMessage(message)
  })
  next()
}
module.exports = [messageMiddleware]
