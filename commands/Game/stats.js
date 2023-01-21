const commaNumber = require('comma-number')
const Player = require('../../scripts/database/models/Player')
const Calculations = require('../../scripts/helpers/calculations')
// https://discordjs.guide/popular-topics/embeds.html#attaching-images
module.exports = {
  name: 'stats',
  description: '',
  aliases: ['s'],
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

    const exampleEmbed = {
      color: 0x0099ff,
      author: {
        name: 'Player Statistics',
      },
      // description: 'A basic overview of your currencies, stats, and more.',
      thumbnail: {
        url: message.author.displayAvatarURL(),
      },
      fields: [
        {
          name: ':crossed_swords: Player Level',
          value: '` ' + player.level + ' `',
          inline: true,
        },
        {
          name: ':coin: Coins',
          value: '` ' + commaNumber(parseFloat(coins).toFixed(2)) + ' `',
          inline: true,
        },
        {
          name: ':gem: Gems',
          value: '` ' + player.prestigePoints + ' `',
          inline: true,
        },
        {
          name: ':alarm_clock: Hourly Rate',
          value: '` ' + commaNumber((0.02777777777 * (player.level + 1) * 60 * 60 * (player.prestigePoints * 0.01 + 1)).toFixed(2)) + ' / hr' + ' `',
          inline: true,
        },
        {
          name: ':arrow_double_up:  Level Up Cost',
          value: '` ' + commaNumber(boostCost) + ' `',
          inline: true,
        },
        {
          name: ':recycle:  Prestiges',
          value: '` ' + player.prestige + ' `',
          inline: true,
        },
      ],
      footer: {
        text: 'If you are ready to upgrade, type !upgrade',
      },
    }
    message.reply({ embeds: [exampleEmbed] })
    return
  },
}

/*
  const ayy = client.emojis.cache.find((emoji) => emoji.name === 'ether')
  message.reply(`${ayy} d`)
*/
