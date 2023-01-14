const commaNumber = require('comma-number')
const File = require('../../scripts/file')

module.exports = {
  name: 'stats',
  description: '',
  aliases: ['s'],
  disabled: false,
  admin: false,
  execute: async (client, message, args) => {
    const data = File.read()

    let players = data.players
    for (let i = 0; i < players.length; i++) {
      if (players[i].id === message.author.id) {
        let player = players[i]
        data.players[i].lastCheck = new Date()

        File.write(data)

        let base = 100
        let count = data.players[i].boost + 1
        let rate = 2
        let boostCost = (base * count ** rate).toFixed(2)

        message.reply(
          ':coin: ` ' +
            commaNumber(data.players[i].coins.toFixed(2)) +
            ' `         ' +
            ':arrow_double_up: ` x' +
            data.players[i].boost +
            ' `         ' +
            ':alarm_clock: ` ' +
            commaNumber((0.02777777777 * (player.boost + 1) * 60 * 60 * (player.prestigePoints * 0.01 + 1)).toFixed(2)) +
            ' / hr `' +
            '         ' +
            ':recycle: ` ' +
            player.prestige +
            ' `         ' +
            ':gem: ` ' +
            data.players[i].prestigePoints +
            ' (+' +
            (data.players[i].prestigePoints * 0.01).toFixed(2) +
            ') `' +
            '\n\n**Next :arrow_double_up: cost :coin: ` ' +
            commaNumber(boostCost) +
            ' `**\n' +
            '**Next Prestige will gain you :gem: ` ' +
            data.players[i].boost +
            ' `**'
        )

        return
      }
    }

    message.reply("Looks like you aren't playing. Use the **!join** command to join in!")
  },
}

/*
  const ayy = client.emojis.cache.find((emoji) => emoji.name === 'ether')
  message.reply(`${ayy} d`)
*/
