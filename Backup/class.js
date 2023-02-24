const commaNumber = require('comma-number')
const Player = require('../scripts/database/models/Player')
const Calculations = require('./calculations')
// https://discordjs.guide/popular-topics/embeds.html#attaching-images
module.exports = {
  name: 'class',
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

    const exampleEmbed = {
      color: '0xfcba03',
      author: {
        name: 'Class Upgrades',
      },
      thumbnail: {
        url: (await client.users.fetch(player.id)).displayAvatarURL(),
      },
      fields: [
        {
          name: 'Warrior (Level 1)',
          value:
            '[:green_square:] [:black_large_square:] [:black_large_square:] [:black_large_square:] [:black_large_square:] [:black_large_square:] [:black_large_square:] [:black_large_square:] [:black_large_square:] [:black_large_square:]',
          inline: false,
        },
        {
          name: 'Rogue (Level 1)',
          value:
            '[:green_square:] [:black_large_square:] [:black_large_square:] [:black_large_square:] [:black_large_square:] [:black_large_square:] [:black_large_square:] [:black_large_square:] [:black_large_square:] [:black_large_square:]',
          inline: false,
        },
        {
          name: 'Mage (Level 1)',
          value:
            '[:green_square:] [:black_large_square:] [:black_large_square:] [:black_large_square:] [:black_large_square:] [:black_large_square:] [:black_large_square:] [:black_large_square:] [:black_large_square:] [:black_large_square:]',
          inline: false,
        },
      ],
      footer: {
        text: 'Class upgrades are permenant and cost gems. Use !class upgrade [className] to upgrade a class and get its cost.',
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
