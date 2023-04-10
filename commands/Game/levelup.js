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
      'There is also !levelup experimentalmax which will be faster but may set your balance slightly negative.',
      'You need to be able to afford more than 100k levels to use it.',
    ]
    if (await Check.checkIfHelp(message, args, sentences, '!levelup', 'Leveling Up (Help)')) return

    // Get Player and Do Checks
    let player = await getPlayer(message)
    if (!player) return

    let level = 0
    let totalCost = 0
    if (args.length === 1 && args[0].toLowerCase() === 'experimentalmax') {
      // we only want the multiplicative algorithm to kick in if more than 100000 levelups are affordable because the series needs to converge on a cubic ratio
      if (player.currencies.coins.current > Calc.getCumulativeLevelUpCost(player.level, player.level + 100000)) {
        let costOfCurrentLevel = Calc.getCumulativeLevelUpCost(0, player.level)
        let moneyMultiple = player.currencies.coins.current / costOfCurrentLevel // how many times more money the player has than the cost of the current level
        let levelMultiple = Math.pow(moneyMultiple+1, 1/3) // how much the player's level will be multiplied by if they spend all their money leveling up
        level = Math.floor(player.level * (levelMultiple - 1))
        totalCost = Calc.getCumulativeLevelUpCost(player.level, player.level + level)
      }
      if (level === 0) {
        message.reply('You broke... use !levelup max if you cannot afford at least 100k levels.')
        return
      }
      if (level === NaN) {
        message.reply('Aborting experimentalmax, level is NaN :(')
        return
      }
      if (totalCost === NaN) {
        message.reply('Aborting experimentalmax, totalCost is NaN :(')
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
    else if (args.length === 1 && args[0].toLowerCase() === 'max') {
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
    } 
    else if (args.length === 1 && args[0].toLowerCase() === 'experimentalmax') {
      // we only want the multiplicative algorithm to kick in if more than 100000 levelups are affordable because the series needs to converge on a cubic ratio
      if (player.currencies.coins.current > Calc.getCumulativeLevelUpCost(player.level, player.level + 100000)) {
        let costOfCurrentLevel = Calc.getCumulativeLevelUpCost(0, player.level)
        let moneyMultiple = player.currencies.coins.current / costOfCurrentLevel // how many times more money the player has than the cost of the current level
        let levelMultiple = Math.pow(moneyMultiple + 1, 1 / 3) // how much the player's level will be multiplied by if they spend all their money leveling up
        level = Math.floor(player.level * (levelMultiple - 1))
        totalCost = Calc.getCumulativeLevelUpCost(player.level, player.level + level)
      }
      if (level === 0) {
        message.reply('You broke... use !levelup max if you cannot afford at least 100k levels.')
        return
      }
      if (level === NaN) {
        message.reply('Aborting experimentalmax, level is NaN :(')
        return
      }
      if (totalCost === NaN) {
        message.reply('Aborting experimentalmax, totalCost is NaN :(')
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
    else {
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
