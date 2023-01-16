const File = require('../file')

const boostCost = (boostLevel) => {
  let base = 100
  let count = boostLevel + 1
  let rate = 2
  let boostCost = (base * count ** rate).toFixed(2)
  return boostCost
}

const currentCoins = (playerID) => {
  let data = File.read()
  let newCoins = 0
  let players = data.players
  for (let i = 0; i < data.players.length; i++) {
    if (players[i].id === playerID) {
      let lastCheck = (new Date() - new Date(players[i].lastCheck)) / 1000
      let player = data.players[i]
      let addedCoins = 0.02777777777 * (player.boost + 1) * (player.prestigePoints * 0.01 + 1) * lastCheck
      data.players[i].coins += addedCoins
      data.players[i].coinsTotal += addedCoins
      data.players[i].lastCheck = new Date()
      newCoins = data.players[i].coins
    }
  }

  File.write(data)
  return newCoins
}

const gemsAtPrestige = (upgrades) => {
  let total = 0
  for (let i = 0; i < upgrades; i++) {
    total += Math.floor(i / 5) + 1
  }
  return total
}

const Calculations = {
  boostCost,
  currentCoins,
  gemsAtPrestige,
}

module.exports = Calculations
