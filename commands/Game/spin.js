const { getPlayer } = require('../../scripts/helpers/database')
const Player = require('../../scripts/database/models/Player')
const SimpleEmbed = require('../../scripts/helpers/simpleEmbed')
const Check = require('../../scripts/helpers/checks')

// Saved User List for Cooldowns
const collectedRecently = {}

module.exports = {
  name: 'spin',
  description: '',
  aliases: [],
  disabled: true,
  admin: false,
  execute: async (client, message, args) => {
    // Return with helpful information
    // let sentences = [
    //   'The rakeback program allows you to earn a portion of your money back on your bets.',
    //   'The standard rate is 2%.',
    //   'As a rogue, this can be upgraded and improved through class upgrades.',
    //   'You can collect every 30 minutes.',
    // ]
    // if (await Check.checkIfHelp(message, args, sentences, '!collect', 'Rakeback Program (Help)')) return

    // Get Player and Do Checks
    const player = await getPlayer(message)
    if (!player) return
  },
}
