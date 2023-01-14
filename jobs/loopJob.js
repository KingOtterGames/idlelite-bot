let CronJob = require('cron').CronJob
let File = require('../scripts/file')

// Runs every second
module.exports = new CronJob(
  '* * * * * *',
  () => {
    // Loop through each player for updates
    let data = File.read()

    for (let i = 0; i < data.players.length; i++) {
      let player = data.players[i]
      let addedCoins = 0.02777777777 * (player.boost + 1) * (player.prestigePoints * 0.01 + 1)
      data.players[i].coins += addedCoins
      data.players[i].coinsTotal += addedCoins
      data.players[i].lastCheck = new Date()
    }

    File.write(data)
  },
  null,
  true,
  'America/Los_Angeles'
)
