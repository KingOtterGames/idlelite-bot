const Player = require('../../scripts/database/models/Player')

module.exports = {
  name: 'collect',
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

    let rakeback = player.rakeback

    if (!rakeback || rakeback === 0) {
      const exampleEmbed = {
        color: '0x02b4f5',
        author: {
          name: 'Collections Program',
        },
        fields: [
          {
            name: 'Rakeback',
            value: 'You have nothing to collect...',
            inline: true,
          },
        ],
      }
      message.reply({ embeds: [exampleEmbed] })
    } else {
      await Player.findOneAndUpdate({ id: player.id }, { $inc: { coins: rakeback }, rakeback: 0.0 })
      const exampleEmbed = {
        color: '0x02b4f5',
        author: {
          name: 'Collections Program',
        },
        fields: [
          {
            name: 'Rakeback',
            value: 'You have collected :coin: ` ' + rakeback.toFixed(2) + ' ` as rakeback from your bets.',
            inline: true,
          },
        ],
        footer: {
          text: 'Every bet, you get 1% of it back here as a reward. Rogues get 10%.',
        },
      }
      message.reply({ embeds: [exampleEmbed] })
    }

    return
  },
}
