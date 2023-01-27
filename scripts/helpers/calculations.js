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
  let newCoins =
    (player?.class === 'warrior' ? 1.3 : 1) * 0.0275 * (player.level + 1) * (player.prestigePoints * (player.class === 'mage' ? 0.005 : 0.01) + 1) * lastCheck
  await Player.findOneAndUpdate({ id: player.id }, { $inc: { coins: parseFloat(newCoins), coinsTotal: parseFloat(newCoins) }, lastCheck: new Date() })
  return player.coins + newCoins
}

const gemsAtPrestige = (player) => {
  return Math.floor(player.coinsTotal / (player.class === 'mage' ? 5000.0 : 10000.0))
}

const Calculations = {
  boostCost,
  currentCoins,
  gemsAtPrestige,
}

module.exports = Calculations
