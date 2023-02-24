const TimeAgo = require('javascript-time-ago')
const en = require('javascript-time-ago/locale/en')
const Player = require('../scripts/database/models/Player')
TimeAgo.addDefaultLocale(en)
const Calculations = require('./calculations')

module.exports = {
  name: 'upgrade',
  description: '',
  aliases: [],
  disabled: false,
  admin: false,
  execute: async (client, message, args) => {
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

    let coins = await Calculations.currentCoins(player)
    let boostCost = Calculations.boostCost(player.level)

    if (coins < boostCost) {
      const exampleEmbed = {
        color: '0xf56702',
        author: {
          name: 'Leveling Up!',
        },
        fields: [
          {
            name: ':warning: Failed to Level Up',
            value: "Looks like you aren't rich enough yet. You need :coin: ` " + (boostCost - coins).toFixed(2) + ' ` more.',
            inline: true,
          },
        ],
      }
      message.reply({ embeds: [exampleEmbed] })
      return
    } else {
      await Player.findOneAndUpdate({ id: player.id }, { coins: coins - boostCost, level: player.level + 1, lastCheck: new Date() })
      const exampleEmbed = {
        color: '0xf56702',
        author: {
          name: 'Leveling Up!',
        },
        fields: [
          {
            name: ':crossed_swords: Successfully Leveled Up!',
            value: 'You are now level ` ' + (player.level + 1) + ' `',
            inline: true,
          },
        ],
        footer: {
          text: 'Each Level, gives you a bonus 100 more coins per hour.',
        },
      }
      message.reply({ embeds: [exampleEmbed] })
      return
    }
  },
}
