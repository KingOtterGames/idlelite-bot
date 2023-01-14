const File = require('../../scripts/file')

module.exports = {
  name: 'join',
  description: '',
  aliases: ['j'],
  disabled: false,
  admin: false,
  execute: async (client, message, args) => {
    const data = File.read()

    let players = data.players
    for (let i = 0; i < players.length; i++) {
      if (players[i].id === message.author.id) {
        message.reply("Looks like you've already joined the game, silly!")
        return
      }
    }

    data.players.push({
      id: message.author.id,
      name: message.author.displayName,
      coins: 0.0,
      coinsTotal: 0.0,
      prestige: 0,
      prestigePoints: 0,
      boost: 0.0,
    })

    File.write(data)

    message.reply('You have joined in on Idle Lite!')
  },
}
