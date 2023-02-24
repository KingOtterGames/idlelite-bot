const Player = require('../scripts/database/models/Player')

const boostCost = (boostLevel) => {
  let base = 100
  let count = boostLevel + 1
  let rate = 2
  let boostCost = (base * count ** rate).toFixed(2)
  return boostCost
}

const currentCoins = async (player) => {
  if (!player.upgrades?.classes?.warrior) {
    await Player.findOneAndUpdate(
      { id: player.id },
      {
        upgrades: {
          classes: {
            warrior: {
              current: 0,
              max: 5,
            },
            mage: {
              current: 0,
              max: 5,
            },
            rogue: {
              current: 0,
              max: 5,
            },
          },
        },
      }
    )
  }

  let lastCheck = (new Date() - new Date(player.lastCheck)) / 1000
  let newCoins = (player?.class === 'warrior' ? 1.3 : 1) * 0.0275 * (player.level + 1) * (player.prestigePoints * 0.01 + 1) * lastCheck
  return newCoins
}

const gemsAtPrestige = (player) => {
  return Math.floor(player.coinsTotal / (player.class === 'mage' ? 7000.0 : 10000.0)) + player.level
}

const Calculations = {
  boostCost,
  currentCoins,
  gemsAtPrestige,
}

module.exports = Calculations
