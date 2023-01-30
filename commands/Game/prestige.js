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

    let newGems = Calculations.gemsAtPrestige(player)

    if (newGems < 1) {
      const exampleEmbed = {
        color: '0x02b4f5',
        author: {
          name: 'Prestige',
        },
        fields: [
          {
            name: ':warning: Problem Prestiging',
            value: 'You will need to wait until you will at least earn :gem: `1`',
            inline: true,
          },
        ],
      }
      message.reply({ embeds: [exampleEmbed] })
      return
    }

    if (args.length >= 1 && args[0] === 'confirm') {
      const classes = ['noob', 'warrior', 'rogue', 'mage']
      if (args.length === 1 || !classes.includes(args[1].toLowerCase())) {
        const exampleEmbed = {
          color: '0x02b4f5',
          author: {
            name: 'Prestige',
          },
          fields: [
            {
              name: ':warning: Problem Prestiging',
              value: 'Please choose a class. The command is `!prestige confirm [Class]`. The classes to choose from are: **Noob, Warrior, Rogue, Mage**.',
              inline: true,
            },
          ],
        }
        message.reply({ embeds: [exampleEmbed] })
        return
      }
      await Player.findOneAndUpdate(
        { id: player.id },
        {
          coins: 0.0,
          prestigePoints: player.prestigePoints + newGems,
          prestige: player.prestige + 1,
          level: 0,
          rakeback: 0,
          coinsTotal: 0,
          lastCheck: new Date(),
          class: args[1].toLowerCase(),
        }
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
            name: ':gem: Gems you will earn',
            value: '` ' + newGems + ' `',
            inline: true,
          },
          {
            name: 'Gems worth',
            value: 'Each :gem: adds a bonus **1%** to your hourly idle rate.',
            inline: false,
          },
          {
            name: ':star: Ready to Prestige?',
            value: 'Type `!prestige confirm [Class]` if you are ready to prestige and reset everything.',
            inline: false,
          },
          {
            name: 'Warrior Class',
            value: '1.3x higher idle gains',
            inline: true,
          },
          {
            name: 'Rogue Class',
            value: '10% Rakeback on bets (vs 1%)',
            inline: true,
          },
          {
            name: 'Mage Class',
            value: 'Gain Gems Every 7K instead of 10K',
            inline: true,
          },
        ],
      }
      message.reply({ embeds: [exampleEmbed] })
    }
    return
  },
}
