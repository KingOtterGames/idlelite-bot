const commaNumber = require('comma-number')
const File = require('../../scripts/file')
const Calculations = require('../../scripts/helpers/calculations')

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

        let coins = Calculations.currentCoins(message.author.id)
        let boostCost = Calculations.boostCost(data.players[i].boost)
        data.players[i].lastCheck = new Date()

        message.reply(
          ':coin: ` ' +
            commaNumber(parseFloat(coins).toFixed(2)) +
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
            Calculations.gemsAtPrestige(data.players[i].boost) +
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
