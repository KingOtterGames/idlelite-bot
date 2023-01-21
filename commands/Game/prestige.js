const Player = require('../../scripts/database/models/Player')
const Calculations = require('../../scripts/helpers/calculations')

module.exports = {
  name: 'prestige',
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

    let newGems = Calculations.gemsAtPrestige(player.level)

    let gemsNeeded = player.prestige
    if (gemsNeeded > Calculations.gemsAtPrestige(player.level)) {
      const exampleEmbed = {
        color: '0x02b4f5',
        author: {
          name: 'Prestige',
        },
        fields: [
          {
            name: ':warning: Problem Prestiging',
            value: 'Come back when you will at least earn :gem: ` ' + gemsNeeded + ' ` from prestiging!',
            inline: true,
          },
        ],
      }
      message.reply({ embeds: [exampleEmbed] })
      return
    }

    if (args.length === 1 && args[0] === 'confirm') {
      await Player.findOneAndUpdate(
        { id: player.id },
        { coins: 0.0, prestigePoints: player.prestigePoints + newGems, prestige: player.prestige + 1, level: 0, lastCheck: new Date() }
      )
      const exampleEmbed = {
        color: '0x02b4f5',
        author: {
          name: 'Prestige',
        },
        fields: [
          {
            name: ':white_check_mark: Prestige Complete!',
            value: 'You have prestiged! Everything has been reset, except your new bonuses. You gained :gem: ` ' + newGems + ' `',
            inline: true,
          },
        ],
      }
      message.reply({ embeds: [exampleEmbed] })
    } else {
      const exampleEmbed = {
        color: '0x02b4f5',
        author: {
          name: 'Prestige',
        },
        fields: [
          {
            name: ':crossed_swords: Current Level',
            value: '` ' + player.level + ' `',
            inline: true,
          },
          {
            name: ':gem: Gems you will earn',
            value: '` ' + newGems + ' `',
            inline: true,
          },
          {
            name: 'Gems worth',
            value: 'Each :gem: adds a bonus **1%** to your hourly idle rate',
            inline: false,
          },
          {
            name: ':star: Read to Prestige?',
            value: 'Type `!prestige confirm` if you are ready to prestige and reset everything.',
            inline: false,
          },
        ],
        footer: {
          text: 'Every 5 player levels, you get an additional gem for each level. 1-5 you get 1 gem each, 6-10 you get 2 gems each, etc.',
        },
      }
      message.reply({ embeds: [exampleEmbed] })
    }
    return
  },
}
