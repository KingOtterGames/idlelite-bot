const Player = require('../database/models/Player')

const boostCost = (boostLevel) => {
  let base = 100
  let count = boostLevel + 1
  let rate = 2
  let boostCost = (base * count ** rate).toFixed(2)
  return boostCost
}

const currentCoins = async (player) => {
  let lastCheck = (new Date() - new Date(player.lastCheck)) / 1000
  let newCoins = player.coins + 0.02777777777 * (player.level + 1) * (player.prestigePoints * 0.01 + 1) * lastCheck
  await Player.findOneAndUpdate({ id: player.id }, { coins: newCoins, lastCheck: new Date() })
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
