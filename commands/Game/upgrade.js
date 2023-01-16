const TimeAgo = require('javascript-time-ago')
const en = require('javascript-time-ago/locale/en')
TimeAgo.addDefaultLocale(en)
const File = require('../../scripts/file')
const Calculations = require('../../scripts/helpers/calculations')

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
        let coins = Calculations.currentCoins(message.author.id)
        let boostCost = Calculations.boostCost(data.players[i].boost)
        data.players[i].lastCheck = new Date()

        if (coins < boostCost) {
          message.reply("Looks like you aren't rich enough yet. You need :coin: " + (boostCost - coins).toFixed(2) + ' more.')
          return
        } else {
          data.players[i].coins = coins - boostCost
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
