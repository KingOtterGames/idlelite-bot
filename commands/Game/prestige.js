const File = require('../../scripts/file')

module.exports = {
  name: 'prestige',
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

        if (args.length === 1 && args[0] === 'confirm') {
          let gems = player.boost
          data.players[i].prestigePoints += player.boost
          data.players[i].prestige += 1
          data.players[i].coins = 0
          data.players[i].coinsTotal = 0
          data.players[i].boost = 0
          message.reply('You have prestiged! Everything has been reset, except your new bonuses. You gained :gem: ` ' + gems + ' `')

          File.write(data)
        } else {
          message.reply(
            `If you prestige, you will gain :gem: \`${player.boost}\` based on your total of :arrow_double_up: \`${player.boost}\`.\nEach :gem: is worth \`+0.01\` :coin: / sec\n\nIf you want this, type **!prestige confirm**`
          )
        }
        return
      }
    }
    return
  },
}
