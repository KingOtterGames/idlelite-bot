const { getPlayer } = require('../../scripts/helpers/database')
const Player = require('../../scripts/database/models/Player')
const SimpleEmbed = require('../../scripts/helpers/simpleEmbed')
const Check = require('../../scripts/helpers/checks')
const Calc = require('../../scripts/helpers/calc')
const Convert = require('../../scripts/helpers/conversions')

module.exports = {
  name: 'prestige',
  description: '',
  aliases: [],
  disabled: false,
  admin: false,
  execute: async (client, message, args) => {
    // Return with helpful information
    let sentences = [
      'You need to earn at least :gem: ` 1 ` before you can prestige.',
      'You earn gems through idle coin gains and other collected money (excluding gambling).',
      'The standard rate is every :coin: ` 10,000 `, you earn a gem. Upgardes make it cheaper.',
    ]
    if (await Check.checkIfHelp(message, args, sentences, '!prestige', 'Prestige (Help)')) return

    // Get Player and Do Checks
    const player = await getPlayer(message)
    if (!player) return

    // Get Earned Gems
    let gemsEarned = await Convert.wholeDisplay(await Calc.getEarnedGems(player))
    let validClasses = ['none', 'warrior', 'rogue', 'mage']

    if (args.length === 0) {
      SimpleEmbed.log(
        message,
        '!prestige',
        'Prestige',
        'You will gain :gem: ` ' +
          gemsEarned +
          ' ` if you prestige now.\n\nIf you are ready, type **!prestige confirm [class]**\n\nValid classes include: **' +
          validClasses.toString().replaceAll(',', ', ') +
          '**',
        'blue'
      )
    } else {
      if (gemsEarned < 1) {
        SimpleEmbed.log(message, '!prestige', 'Prestige', 'You need to at least earn :gem: ` 1 ` before you can prestige.', 'red')
      } else if (args.length === 2 && args[0] === 'confirm' && validClasses.includes(args[1].toLowerCase())) {
        let gems = await Calc.getEarnedGems(player)
        await Player.findOneAndUpdate(
          { id: player.id },
          {
            $inc: { 'currencies.gems.current': gems, 'currencies.gems.total': gems },
            'currencies.coins.current': 0,
            'currencies.coins.total': 0,
            level: 0,
            rakeback: 0,
            'games.dice.earnings.current': 0,
            lastCheck: new Date(),
            class: args[1].toLowerCase(),
          }
        )

        SimpleEmbed.log(message, '!prestige', 'Prestige', 'You have prestiged and have earned :gem: ` ' + gemsEarned + ' `.', 'green')
      } else {
        SimpleEmbed.log(
          message,
          '!prestige',
          'Prestige',
          'Make sure you type the command correctly. !prestige confirm [class] is the proper command.\n\nValid classes include: **' +
            validClasses.toString().replaceAll(',', ', ') +
            '**',
          'red'
        )
      }
    }
  },
}
