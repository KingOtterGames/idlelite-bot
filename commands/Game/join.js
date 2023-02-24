const Player = require('../../scripts/database/models/Player')
const { checkIfCorrectChannel } = require('../../scripts/helpers/checks')
const SimpleEmbed = require('../../scripts/helpers/simpleEmbed')
module.exports = {
  name: 'join',
  description: '',
  aliases: [],
  disabled: false,
  admin: false,
  execute: async (client, message, args) => {
    // Check if they are in the game and in proper channel
    if (!(await checkIfCorrectChannel(message))) return

    // Grab Player
    const player = await Player.findOne({ id: message.author.id })

    // Check if player is already playing
    if (player) {
      SimpleEmbed.log(message, '!join', 'Joining Idle Lite', 'You are already playing.', 'red')
      return
    }

    // Create new player
    await Player.create({ id: message.author.id })

    // Message for Joining
    SimpleEmbed.log(message, '!join', 'Joining Idle Lite', 'Welcome to Idle Lite. For more information, check out <#1063883970363801671>.', 'green')
  },
}
