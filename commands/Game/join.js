const Player = require('../../scripts/database/models/Player')
const File = require('../../scripts/file')

module.exports = {
  name: 'join',
  description: '',
  aliases: ['j'],
  disabled: false,
  admin: false,
  execute: async (client, message, args) => {
    const player = await Player.findOne({ id: message.author.id })

    // If player isn't found
    if (player) {
      const exampleEmbed = {
        color: '0xede100',
        author: {
          name: 'Joining Idle Lite',
        },
        fields: [
          {
            name: ':warning: Failed to Join',
            value: 'It seems as if you are already playing. If you think this is an error, please ping @braymen',
            inline: true,
          },
        ],
      }
      message.reply({ embeds: [exampleEmbed] })
      return
    }

    await Player.create({
      id: message.author.id,
      coins: 0.0,
      coinsTotal: 0.0,
      prestige: 0,
      prestigePoints: 0,
      level: 0,
      lastCheck: new Date(),
      bags: 0,
      dice: [0, 0, 0, 0],
      class: 'Noob',
    })

    const exampleEmbed = {
      color: '0x6803ff',
      author: {
        name: 'Joining Idle Lite',
      },
      fields: [
        {
          name: ':white_check_mark: Successfully Joined Game',
          value: 'Welcome to Idle Lite, Keeper! Begin your journey, reading the guide in <#1063883970363801671>.',
          inline: true,
        },
      ],
    }
    message.reply({ embeds: [exampleEmbed] })
    return
  },
}
