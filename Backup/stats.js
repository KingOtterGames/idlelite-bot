const commaNumber = require('comma-number')
const Player = require('../scripts/database/models/Player')
const Calculations = require('./calculations')
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

    let oldCoins = player.coins
    let coins = await Calculations.currentCoins(player)
    let coinsTotal = player.coinsTotal + coins - oldCoins
    let boostCost = Calculations.boostCost(player.level)
    let newGems = Calculations.gemsAtPrestige(player)

    let classBuff = 'None'
    if (player.class === 'warrior') {
      classBuff = '1.3x higher idle gains'
    } else if (player.class === 'rogue') {
      classBuff = '10% Rakeback on bets (vs 1%)'
    } else if (player.class === 'mage') {
      classBuff = 'Gain Gems Every 7K instead of 10K'
    }

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
          value:
            '` ' +
            commaNumber(((player.class === 'warrior' ? 1.3 : 1.0) * 0.0275 * (player.level + 1) * 60 * 60 * (player.prestigePoints * 0.01 + 1)).toFixed(2)) +
            ' / hr' +
            ' `',
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
        {
          name: 'Class',
          value: player.class ? player.class.charAt(0).toUpperCase() + player.class.slice(1) : 'None',
          inline: true,
        },
        {
          name: 'Effect',
          value: classBuff,
          inline: true,
        },
        {
          name: 'Idle Coins until Next Gem',
          value:
            ':coin: ' +
            commaNumber(parseFloat((player.class === 'mage' ? 7000.0 : 10000.0) - (coinsTotal % (player.class === 'mage' ? 7000.0 : 10000.0))).toFixed(2)),
          inline: true,
        },
        {
          name: 'Ready to prestige?',
          value: 'You will earn :gem: `' + newGems + '`.',
          inline: false,
        },
      ],
      footer: {
        text: 'If you are ready to level up, do !upgrade. This improves your idle rate. If you are ready to prestige, do !prestige.',
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
