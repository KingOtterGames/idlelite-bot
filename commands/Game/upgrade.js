const { getPlayer } = require('../../scripts/helpers/database')
const Player = require('../../scripts/database/models/Player')
const SimpleEmbed = require('../../scripts/helpers/simpleEmbed')
const Check = require('../../scripts/helpers/checks')
const Calc = require('../../scripts/helpers/calc')

module.exports = {
  name: 'upgrade',
  description: '',
  aliases: [],
  disabled: false,
  admin: false,
  execute: async (client, message, args) => {
    // Return with helpful information
    let sentences = [
      'You can do !dice all, to gamble everything you own.',
      'You can do !gamble 10%, to gamble a percentage of your coins.',
      'For every bet, you gain rakeback which can be collected with !collect. The standard rate is 2%, but differs based on classes and upgrades.',
      'View your overall earnings and dice stats with !dice stats',
    ]
    if (await Check.checkIfHelp(message, args, sentences, '!dice', 'Dice Game (Help)')) return

    // Get Player and Do Checks
    const player = await getPlayer(message)
    if (!player) return

    // Invalid amount of arguments
    if (args.length < 2 && args.length > 3) {
      SimpleEmbed.error(message, 'Invalid amount of arguments when running this command.')
      return
    }

    function canAfford(cost) {
      if (player.currencies.gems.current >= cost) {
        return true
      }
      return false
    }

    // Attempt to make an upgrade
    try {
      let current = player.upgrades[args[0]][args[1]].current
      let max = player.upgrades[args[0]][args[1]].max
      if (current >= max) {
        SimpleEmbed.error(message, 'This upgrade is already maxed out.')
        return
      }
      let cost = await Calc.getAbilityUpgradeCost(current)
      if (!canAfford(cost)) {
        SimpleEmbed.error(message, 'You cannot afford this upgrade.')
        return
      }

      // Update the player
      await Player.findOneAndUpdate(
        { id: player.id },
        {
          $inc: { ['upgrades.' + args[0] + '.' + args[1] + '.current']: 1, 'currencies.gems.current': -cost },
        }
      )

      SimpleEmbed.log(message, '!upgrade', 'Upgrading System', 'You have successfully upgraded **' + args[1] + '** for :gem: ` ' + cost + ' `.', 'green')
    } catch (err) {
      SimpleEmbed.error(message, 'Something is wrong with the format of your upgrade.')
    }
  },
}
