const Player = require('../../scripts/database/models/Player')
const TimeAgo = require('javascript-time-ago')
const en = require('javascript-time-ago/locale/en')
TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US')
const commaNumber = require('comma-number')

module.exports = {
  name: 'top',
  description: '',
  aliases: ['t'],
  disabled: false,
  admin: false,
  execute: async (client, message, args) => {
    const players = await Player.find({}).sort({ prestigePoints: -1 }).limit(5)

    let fields = []
    for (let i = 0; i < players.length; i++) {
      fields.push({
        name: (await client.users.fetch(players[i].id)).username,
        value:
          ':gem: ' +
          commaNumber(players[i].prestigePoints) +
          '    :coin: ' +
          commaNumber(players[i].coins.toFixed(0)) +
          ' *` active ' +
          timeAgo.format(new Date(players[i].lastCheck)) +
          ' `*',
      })
    }

    const exampleEmbed = {
      color: '0xfcba03',
      author: {
        name: 'Top Players',
      },
      thumbnail: {
        url: (await client.users.fetch(players[0].id)).displayAvatarURL(),
      },
      fields: fields,
      footer: {
        text: 'This is based on prestige points as coin amount is inaccurate.',
      },
    }
    message.reply({ embeds: [exampleEmbed] })
  },
}
