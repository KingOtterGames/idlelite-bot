const Errors = require('./errors')
const SimpleEmbed = require('./simpleEmbed')

const checkIfCorrectChannel = async (message) => {
  if (message.channel.id === '1065849053679726692' || message.channel.id === '1051753625258577930') {
    return true
  }
  return false
}

const checkIfJoined = async (player, message) => {
  if (!player) {
    Errors.playerNotJoined(message)
    return false
  }
  return true
}

const checkIfHelp = async (message, args, sentences, command, title) => {
  if (args.length > 0 && args[0] === 'help') {
    let helpText = ''
    for (line in sentences) {
      helpText += '• ' + sentences[line] + '\n'
    }
    SimpleEmbed.log(message, command, title, helpText, 'blue')
    return true
  }
  return false
}

module.exports = {
  checkIfCorrectChannel,
  checkIfJoined,
  checkIfHelp,
}
