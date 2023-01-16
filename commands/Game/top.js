const File = require('../../scripts/file')

module.exports = {
  name: 'top',
  description: '',
  aliases: ['t'],
  disabled: true,
  admin: false,
  execute: async (client, message, args) => {
    const data = File.read()

    let players = data.players.sort((a, b) => b.coins - a.coins)
    let m = '**---- Top Players ----**'
    for (let i = 0; i < players.length; i++) {
      m += '\n' + players[i].id + ' - :coin: ' + players[i].coins.toFixed(2)
    }

    message.reply(m)
  },
}
