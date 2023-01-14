const TimeAgo = require('javascript-time-ago')
const en = require('javascript-time-ago/locale/en')
TimeAgo.addDefaultLocale(en)
const File = require('../../scripts/file')

module.exports = {
  name: 'upgrade',
  description: '',
  aliases: [],
  disabled: false,
  admin: false,
  execute: async (client, message, args) => {
    const data = File.read()

    let players = data.players
    for (let i = 0; i < players.length; i++) {
      if (players[i].id === message.author.id) {
        let player = players[i]

        let base = 100
        let count = data.players[i].boost + 1
        let rate = 2
        let boostCost = (base * count ** rate).toFixed(2)

        if (player.coins < boostCost) {
          message.reply("Looks like you aren't rich enough yet. You need :coin: " + (boostCost - player.coins).toFixed(2) + ' more.')
          return
        } else {
          data.players[i].coins -= boostCost
          data.players[i].boost += 1
          message.reply('You have upgraded your :arrow_double_up: to ' + data.players[i].boost + '!')
        }

        File.write(data)

        return
      }
    }

    message.reply("Looks like you aren't playing. Use the **!join** command to join in!")
  },
}
