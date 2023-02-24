const { getPlayer } = require('../../scripts/helpers/database')
const Player = require('../../scripts/database/models/Player')
const Calc = require('../../scripts/helpers/calc')
const Check = require('../../scripts/helpers/checks')

module.exports = {
  name: 'levelup',
  description: '',
  aliases: [],
  disabled: false,
  admin: false,
  execute: async (client, message, args) => {
    // Return with helpful information
    let sentences = [
      'If you want to level up the max amount of times you can afford, do !levelup max.',
      'Leveling up will increase your idle gains by a standard rate of :coin: 100',
      'Levels are reset when you prestige',
    ]
    if (await Check.checkIfHelp(message, args, sentences, '!levelup', 'Leveling Up (Help)')) return

    // Get Player and Do Checks
    let player = await getPlayer(message)
    if (!player) return

    let level = 0
    let totalCost = 0
    if (args.length === 1 && args[0].toLowerCase() === 'max') {
      while (totalCost < player.currencies.coins.current) {
        let cost = await Calc.getLevelUpCost(level + player.level)
        if (totalCost + cost < player.currencies.coins.current) {
          level++
          totalCost += cost
        } else {
          if (level === 0) {
            message.reply('You broke...')
            return
          }

          player = await Player.findOneAndUpdate(
            { id: player.id },
            {
              $inc: { level: level, 'currencies.coins.current': -totalCost },
              lastCheck: new Date(),
            },
            { new: true }
          )
          message.reply('You leveled up: ' + level + ' times. It cost :coin: ' + totalCost + '. Your new level is ' + player.level)
          return
        }
      }
    } else {
      let cost = await Calc.getLevelUpCost(level + player.level)
      if (cost > player.currencies.coins.current) {
        message.reply('You broke...')
      } else {
        player = await Player.findOneAndUpdate(
          { id: player.id },
          {
            $inc: { level: 1, 'currencies.coins.current': -cost },
            lastCheck: new Date(),
          },
          { new: true }
        )
        message.reply('You just leveled up and are now level: ' + player.level)
      }
    }
  },
}
