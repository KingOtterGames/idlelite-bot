const TimeAgo = require('javascript-time-ago')
const commaNumber = require('comma-number')
const en = require('javascript-time-ago/locale/en')
TimeAgo.addDefaultLocale(en)
const Player = require('../../scripts/database/models/Player')
const Calculations = require('../../scripts/helpers/calculations')

module.exports = {
  name: 'dice',
  description: '',
  aliases: [],
  disabled: false,
  admin: false,
  execute: async (client, message, args) => {
    function containsOnlyNumbers(str) {
      return /^\d+$/.test(str)
    }

    function containsPercent(str) {
      if (/^(\d+|(\.\d+))(\.\d+)?%$/.test(str)) {
        return true
      }
      return false
    }

    if (args.length !== 1) {
      const exampleEmbed = {
        color: '0xede100',
        author: {
          name: 'Running Command',
        },
        fields: [
          {
            name: ':warning: Failed to Run Command',
            value: 'Please include your bet like so: `!dice 50` or `!dice 50%`',
            inline: true,
          },
        ],
      }
      message.reply({ embeds: [exampleEmbed] })
      return
    } else if (!containsOnlyNumbers(args[0]) && args[0] !== 'all' && args[0] !== 'stats' && !containsPercent(args[0])) {
      const exampleEmbed = {
        color: '0xede100',
        author: {
          name: 'Running Command',
        },
        fields: [
          {
            name: ':warning: Failed to Run Command',
            value: 'That is not a valid number...',
            inline: true,
          },
        ],
      }
      message.reply({ embeds: [exampleEmbed] })
      return
    } else if (parseInt(args[0]) == 0) {
      const exampleEmbed = {
        color: '0xede100',
        author: {
          name: 'Running Command',
        },
        fields: [
          {
            name: ':warning: Failed to Run Command',
            value: "You can't gamble 0...",
            inline: true,
          },
        ],
      }
      message.reply({ embeds: [exampleEmbed] })
      return
    }

    const player = await Player.findOne({ id: message.author.id })

    // If player isn't found
    if (!player) {
      const exampleEmbed = {
        color: '0xede100',
        author: {
          name: 'Running Command',
        },
        fields: [
          {
            name: ':warning: Failed to Run Command',
            value: "Looks like you aren't playing. Use the **!join** command to join in!",
            inline: true,
          },
        ],
      }
      message.reply({ embeds: [exampleEmbed] })
      return
    }

    // Formatter from old data
    let dice
    if (player.dice?.length > 0) {
      dice = player.dice
    } else {
      dice = [0, 0, 0, 0]
    }

    let bet = args[0]

    if (containsPercent(bet)) {
      let percent = parseFloat(bet.replace('%', '')) / 100.0

      if (percent > 0 && percent <= 1) {
        bet = player.coins * percent
      } else {
        message.reply('Invalid bounds for a percent bet... Needs to be between 0-100%')
        return
      }
    }

    if (bet === 'stats') {
      let diceTotal = dice[0] + dice[1] + dice[2] + dice[3]
      const exampleEmbed = {
        color: '0x0099ff',
        author: {
          name: 'Your Dice Stats',
        },
        fields: [
          {
            name: ':trophy: Wins',
            value: '' + (dice[0] + dice[1]) + ' ***(' + (((dice[0] + dice[1]) / diceTotal) * 100).toFixed(2) + '%)***',
            inline: true,
          },
          {
            name: ':handshake: Draws',
            value: '' + dice[2] + ' ***(' + ((dice[2] / diceTotal) * 100).toFixed(2) + '%)***',
            inline: true,
          },
          {
            name: ':firecracker: Losses',
            value: '' + dice[3] + ' ***(' + ((dice[3] / diceTotal) * 100).toFixed(2) + '%)***',
            inline: true,
          },
          {
            name: (player.diceCurrent.toFixed(2) > 0 ? '📈' : '📉') + ' Net (Current)',
            value: '`' + commaNumber(player.diceCurrent.toFixed(2)) + '`',
            inline: true,
          },
          {
            name: (player.diceLifetime.toFixed(2) > 0 ? '📈' : '📉') + ' Net (Lifetime)',
            value: '`' + commaNumber(player.diceLifetime.toFixed(2)) + '`',
            inline: true,
          },
        ],
      }
      message.reply({ embeds: [exampleEmbed] })
      return
    }
    let coins = await Calculations.currentCoins(player)
    if (bet === 'all') {
      bet = coins
    }

    Math.floor(bet)
    if (coins < bet) {
      const exampleEmbed = {
        color: '0xede100',
        author: {
          name: 'Running Command',
        },
        fields: [
          {
            name: ':warning: Failed to Run Command',
            value: "Looks like you are broke or can't afford that... Wait for your :coins: to come in.",
            inline: true,
          },
        ],
      }
      message.reply({ embeds: [exampleEmbed] })
      return
    }

    let diceSize = 10
    let playerRoll = [Math.floor(Math.random() * diceSize) + 1, Math.floor(Math.random() * diceSize) + 1]
    let computerRoll = [Math.floor(Math.random() * diceSize) + 1, Math.floor(Math.random() * diceSize) + 1]

    let playerTotal = playerRoll[0] + playerRoll[1]
    let computerTotal = computerRoll[0] + computerRoll[1]
    let total = 0
    let outcomeText = 'You have :handshake: **DRAWN** and have gain back your :coin: ` ' + parseFloat(bet).toFixed(2) + ' `'

    let winningsLifetime = player.diceLifetime || 0
    let winningsCurrent = player.diceCurrent || 0

    if (playerTotal > computerTotal) {
      if (playerRoll[0] === playerRoll[1]) {
        dice[1] += 1
        total = bet * 2
        winningsLifetime += parseFloat(bet * 2)
        winningsCurrent += parseFloat(bet * 2)
        outcomeText = 'You have :trophy: **WON** with :snake: **SNAKE EYES**, for a total of :coin: ` ' + parseFloat(bet * 2).toFixed(2) + ' `'
      } else {
        dice[0] += 1
        total = bet
        winningsLifetime += parseFloat(bet)
        winningsCurrent += parseFloat(bet)
        outcomeText = 'You have :trophy: **WON** a total of :coin: ` ' + parseFloat(bet).toFixed(2) + ' `'
      }
    } else if (playerTotal < computerTotal) {
      dice[3] += 1
      total = -bet
      winningsLifetime -= parseFloat(bet)
      winningsCurrent -= parseFloat(bet)
      outcomeText = 'You have :firecracker: **LOST** a total of :coin: ` ' + parseFloat(bet).toFixed(2) + ' `'
    } else {
      dice[2] += 1
    }

    let rakeback = (player.class === 'rogue' ? 0.15 : 0.01) * parseFloat(bet)
    if (player.rakeback) {
      rakeback += parseFloat(player.rakeback)
    }

    await Player.findOneAndUpdate(
      { id: player.id },
      { $inc: { coins: parseFloat(total) }, lastCheck: new Date(), dice, diceCurrent: winningsCurrent, diceLifetime: winningsLifetime, rakeback }
    )

    let color = 'fc2803'
    if (total > 0) {
      color = '04c904'
    } else if (total === 0) {
      color = 'fcba03'
    }
    const exampleEmbed = {
      color: '0x' + color,
      author: {
        name: 'Your Dice Stats',
      },
      fields: [
        {
          name: ':game_die: Your Rolls',
          value: '***' + playerRoll[0] + '*** + ***' + playerRoll[1] + '*** = ***' + (playerRoll[0] + playerRoll[1]) + '***',
          inline: true,
        },
        {
          name: ':game_die: Computer Rolls',
          value: '***' + computerRoll[0] + '*** + ***' + computerRoll[1] + '*** = ***' + (computerRoll[0] + computerRoll[1]) + '***',
          inline: true,
        },
        {
          name: 'Results',
          value: outcomeText + '\nNew Balance: :coin: ` ' + commaNumber((parseFloat(coins) + parseFloat(total)).toFixed(2)) + ' `',
          inline: false,
        },
      ],
    }
    message.reply({ embeds: [exampleEmbed] })
    return
  },
}
