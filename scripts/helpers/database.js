const Player = require('../database/models/Player')
const { checkIfJoined, checkIfCorrectChannel } = require('./checks')
const Calc = require('./calc')

const getPlayer = async (message) => {
  // Grab Player
  const player = await Player.findOne({ id: message.author.id })

  // Check if they are in the game and in proper channel
  if (!(await checkIfJoined(player, message))) return
  if (!(await checkIfCorrectChannel(message))) return

  // Do Calculations on Player here for stats...
  let earnedCoins = await Calc.getEarnedCoins(player)
  return await Player.findOneAndUpdate(
    { id: player.id },
    {
      $inc: { 'currencies.coins.current': earnedCoins, 'currencies.coins.total': earnedCoins },
      lastCheck: new Date(),
    },
    { new: true }
  )
}

module.exports = {
  getPlayer,
}
