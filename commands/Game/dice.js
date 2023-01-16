const TimeAgo = require('javascript-time-ago')
const en = require('javascript-time-ago/locale/en')
TimeAgo.addDefaultLocale(en)
const File = require('../../scripts/file')
const Calculations = require('../../scripts/helpers/calculations')

module.exports = {
  name: 'dice',
  description: '',
  aliases: [],
  disabled: false,
  admin: false,
  execute: async (client, message, args) => {
    const data = File.read()

    if (args.length === 1 && args[0] === 'stats') {
      let statsTotal = data.stats.dice.wins + data.stats.dice.losses + data.stats.dice.draws
      let wins = data.stats.dice.wins
      let draws = data.stats.dice.draws
      let losses = data.stats.dice.losses
      message.reply(
        `**Wins:** ${wins} (${((wins / statsTotal) * 100).toFixed(2)}%)    **Draws:** ${draws} (${((draws / statsTotal) * 100).toFixed(
          2
        )}%)    **Losses:** ${losses} (${((losses / statsTotal) * 100).toFixed(2)}%)`
      )
      return
    }

    let players = data.players
    for (let i = 0; i < players.length; i++) {
      if (players[i].id === message.author.id && args.length === 1) {
        let player = players[i]
        let coins = Calculations.currentCoins(message.author.id)
        console.log(coins)

        let bet = args[0]
        if (bet === 'all') {
          bet = coins
        }

        function containsOnlyNumbers(str) {
          return /^\d+$/.test(str)
        }

        if (args.length !== 1) {
          message.reply('Please include your bet like so: `!dice 50`')
          return
        } else if (!containsOnlyNumbers(args[0]) && args[0] !== 'all') {
          message.reply('That is not a valid number...')
          return
        }

        Math.floor(bet)
        if (coins < bet) {
          message.reply("You can't afford that you broke fool!")
          return
        }

        let playerRoll = [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1]
        let computerRoll = [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1]

        let playerTotal = playerRoll[0] + playerRoll[1]
        let computerTotal = computerRoll[0] + computerRoll[1]
        let total = 0
        let outcomeText = 'You have **DRAWN** and have recieved :coin: ` ' + parseFloat(bet).toFixed(2) + ' ` back.'

        if (playerTotal > computerTotal) {
          data.stats.dice.wins += 1
          if (playerRoll[0] === playerRoll[1]) {
            total = bet * 2
            data.players[i].coinsTotal = parseFloat(data.players[i].coinsTotal) + parseFloat(total)
            outcomeText = 'You have **WON** and gain :coin: ` ' + parseFloat(bet * 2).toFixed(2) + ' ` (Double your bet for **SNAKEY EYES**)'
          } else {
            total = bet
            data.players[i].coinsTotal = parseFloat(data.players[i].coinsTotal) + parseFloat(total)
            outcomeText = 'You have **WON** and gain :coin: ` ' + parseFloat(bet).toFixed(2) + ' `'
          }
        } else if (playerTotal < computerTotal) {
          data.stats.dice.losses += 1
          total = -bet
          outcomeText = 'You have **LOST** and lose :coin: ` ' + parseFloat(bet).toFixed(2) + ' `'
        } else {
          data.stats.dice.draws += 1
        }

        message.reply(
          'You roll :game_die: **' +
            playerRoll[0] +
            '** and :game_die: **' +
            playerRoll[1] +
            '**' +
            '\nThey roll :game_die: **' +
            computerRoll[0] +
            '** and :game_die: **' +
            computerRoll[1] +
            '**' +
            '\n\n' +
            outcomeText
        )

        data.players[i].coins = parseFloat(coins) + parseFloat(total)
        data.players[i].lastCheck = new Date()
        console.log('---' + data.players[i].coins)
        File.write(data)

        const data2 = File.read()
        const players2 = data2.players
        for (let i = 0; i < players2.length; i++) {
          if (players2[i].id === message.author.id && args.length === 1) {
            console.log('---' + data2.players[i].coins)
          }
        }

        return
      }
    }
  },
}
