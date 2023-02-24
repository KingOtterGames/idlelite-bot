const Player = require('../scripts/database/models/Player')
const File = require('../scripts/file')

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
