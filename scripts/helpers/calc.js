const getEarnedCoins = async (player) => {
  let lastCheck = (new Date() - new Date(player.lastCheck)) / 1000
  let newCoins =
    (await getAbilityModifier(player, 'idleboost')) *
    0.02777777777 *
    (player.level + 1) *
    (Math.min(player.currencies.gems.current, 500) * 0.01 + 1) *
    lastCheck
  return newCoins
}

const getEarnedGems = async (player) => {
  let goldBase = 10000 - (await getAbilityModifier(player, 'cheapergems'))
  return Math.floor(player.currencies.coins.total / goldBase) + player.level
}

const getLevelUpCost = async (currentLevel) => {
  let base = 100
  let count = currentLevel + 1
  let rate = 2
  let boostCost = parseFloat((base * count ** rate).toFixed(2))
  return boostCost
}

const getHourlyRate = async (player) => {
  return (
    (await getAbilityModifier(player, 'idleboost')) *
    0.02777777777 *
    (player.level + 1) *
    60 *
    60 *
    (Math.min(player.currencies.gems.current, 500) * 0.01 + 1)
  ).toFixed(2)
}

const getIdleCoinsNeeded = async (player) => {
  return (
    10000 - (await getAbilityModifier(player, 'cheapergems')) - (player.currencies.coins.total % (10000 - (await getAbilityModifier(player, 'cheapergems'))))
  )
}

const getAbilityModifier = async (player, ability) => {
  let max = parseInt(player.upgrades.ability[ability].max)
  let current = parseInt(Math.min(player.upgrades.ability[ability].current, max))

  if (ability === 'idleboost') {
    return 1 + current * 0.05
  } else if (ability === 'rakeback') {
    return current * 0.01 + 0.02
  } else if (ability === 'cheapergems') {
    return 4000 * 0.1 * current
  }
}

const getAbilityUpgradeCost = async (level) => {
  return (level + 1) * 100
}

module.exports = {
  getEarnedCoins,
  getEarnedGems,
  getLevelUpCost,
  getHourlyRate,
  getIdleCoinsNeeded,
  getAbilityModifier,
  getAbilityUpgradeCost,
}
