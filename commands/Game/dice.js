const { getPlayer } = require('../../scripts/helpers/database')
const Player = require('../../scripts/database/models/Player')
const SimpleEmbed = require('../../scripts/helpers/simpleEmbed')
const Check = require('../../scripts/helpers/checks')
const Convert = require('../../scripts/helpers/conversions')
const Calc = require('../../scripts/helpers/calc')

module.exports = {
  name: 'dice',
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

    function containsOnlyNumbers(str) {
      if (/[+-]?([0-9]*[.])?[0-9]+/.test(str)) {
        return true
      }
      return false
    }

    function containsPercent(str) {
      if (/^(\d+|(\.\d+))(\.\d+)?%$/.test(str)) {
        return true
      }
      return false
    }

    function canAfford(bet) {
      if (bet > player.currencies.coins.current) {
        SimpleEmbed.log(message, '!dice', 'Dice Game', 'You cannot afford this bet.', 'red')
        return false
      }
      return true
    }

    function isZero(bet) {
      if (bet === 0) {
        SimpleEmbed.log(message, '!dice', 'Dice Game', 'You cannot bet :coin: ` 0 `.', 'red')
        return true
      }
      return false
    }

    function roll(diceSize) {
      return [Math.floor(Math.random() * diceSize) + 1, Math.floor(Math.random() * diceSize) + 1]
    }

    if (args.length === 1) {
      let bet
      if (args[0] === 'stats') {
        // Get Dice Stats
        let dice = player.games.dice.stats
        let diceTotal = dice[0] + dice[1] + dice[2] + dice[3]
        message.reply({
          embeds: [
            {
              color: '0x0099ff',
              author: {
                name: 'Your Dice Stats',
              },
              fields: [
                {
                  name: ':trophy: Wins',
                  value: '' + (dice[0] + dice[1]) + '\n ***(' + (diceTotal === 0 ? 0 : (((dice[0] + dice[1]) / diceTotal) * 100).toFixed(2)) + '%)***',
                  inline: true,
                },
                {
                  name: ':handshake: Draws',
                  value: '' + dice[2] + '\n ***(' + (diceTotal === 0 ? 0 : ((dice[2] / diceTotal) * 100).toFixed(2)) + '%)***',
                  inline: true,
                },
                {
                  name: ':firecracker: Losses',
                  value: '' + dice[3] + '\n ***(' + (diceTotal === 0 ? 0 : ((dice[3] / diceTotal) * 100).toFixed(2)) + '%)***',
                  inline: true,
                },
                {
                  name: '📈 Net (Current)',
                  value: '`' + Convert.decimalDisplay(player.games.dice.earnings.current) + '`',
                  inline: true,
                },
                {
                  name: '📈 Net (Lifetime)',
                  value: '`' + Convert.decimalDisplay(player.games.dice.earnings.total) + '`',
                  inline: true,
                },
              ],
            },
          ],
        })
        return
      } else if (args[0] === 'all') {
        // Gamble with ALL
        bet = player.currencies.coins.current
      } else if (containsPercent(args[0])) {
        // Gamble a Percent
        bet = (parseFloat(args[0].replace('%', '')) / 100.0) * player.currencies.coins.current
      } else if (containsOnlyNumbers(args[0])) {
        // Gamble Specific Number
        bet = parseFloat(args[0])
      } else {
        // There is an isue
        SimpleEmbed.log(message, '!dice', 'Dice Game', 'Something is wrong with the way you typed this command.', 'red')
        return
      }

      // Checks
      if (isZero(bet)) return
      if (!canAfford(bet)) return
      if (bet < 0) return

      // Calculate gains
      let betString = await Convert.decimalDisplay(bet)
      let playerRoll = roll(9)
      let playerTotal = playerRoll[0] + playerRoll[1]
      let computerRoll = roll(9)
      let computerTotal = computerRoll[0] + computerRoll[1]
      let diceStats = player.games.dice.stats

      let outcome
      let outcomeText
      if (playerTotal > computerTotal) {
        if (playerRoll[0] === playerRoll[1]) {
          // PLAYER WINS WITH SNAKE EYES
          diceStats[1] += 1
          outcome = bet * 2
          outcomeText = 'You have :trophy: **WON** with :snake: **SNAKE EYES**, for a total of :coin: ` ' + (await Convert.decimalDisplay(bet * 2)) + ' `'
        } else {
          // PLAYER WINS NORMALLY
          diceStats[0] += 1
          outcome = bet
          outcomeText = 'You have :trophy: **WON** a total of :coin: ` ' + (await Convert.decimalDisplay(bet)) + ' `'
        }
      } else if (playerTotal < computerTotal) {
        // COMPUTER WINS
        diceStats[3] += 1
        outcome = -bet
        outcomeText = 'You have :firecracker: **LOST** a total of :coin: ` ' + (await Convert.decimalDisplay(bet)) + ' `'
      } else {
        // DRAW
        diceStats[2] += 1
        outcome = 0
        outcomeText = 'You have :handshake: **DRAWN** and have gain back your bet.'
      }

      let color = 'fc2803'
      if (outcome > 0) {
        color = '04c904'
      } else if (outcome === 0) {
        color = 'fcba03'
      }
      message.reply({
        embeds: [
          {
            color: '0x' + color,
            author: {
              name: 'Dice Game',
            },
            fields: [
              {
                name: 'Your Roll',
                value: ':game_die: **' + playerRoll[0] + '** and :game_die: **' + playerRoll[1] + '**',
                inline: true,
              },
              {
                name: 'Computer Roll',
                value: ':game_die: **' + computerRoll[0] + '** and :game_die: **' + computerRoll[1] + '**',
                inline: true,
              },
              {
                name: 'Results',
                value:
                  outcomeText +
                  '\n\nYour Bet: :coin: ` ' +
                  betString +
                  ' `\nNew Balance: :coin: ` ' +
                  (await Convert.decimalDisplay(player.currencies.coins.current + outcome)) +
                  ' `',
                inline: false,
              },
            ],
          },
        ],
      })

      // Calculate Rakeback
      let rakeback = (await Calc.getAbilityModifier(player, 'rakeback')) * parseFloat(bet)

      // Update the player
      await Player.findOneAndUpdate(
        { id: player.id },
        {
          $inc: { 'currencies.coins.current': outcome, 'games.dice.earnings.current': outcome, 'games.dice.earnings.total': outcome, rakeback: rakeback },
          'games.dice.stats': diceStats,
        }
      )
    }
  },
}
