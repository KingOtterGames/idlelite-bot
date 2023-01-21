const mongoose = require('mongoose')

const collectionName = 'Players'
const schema = new mongoose.Schema(
  {
    id: String,
    coins: Number,
    coinsTotal: Number,
    prestige: Number,
    prestigePoints: Number,
    level: Number,
    lastCheck: String,
    dice: [Number],
  },
  { collection: collectionName }
)

module.exports = mongoose.model(collectionName, schema)
