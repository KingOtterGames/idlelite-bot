const mongoose = require('mongoose')
const Double = require('@mongoosejs/double')

const collectionName = 'Players'
const schema = new mongoose.Schema(
  {
    id: String,
    class: { type: String, default: 'none' },
    level: { type: Number, default: 0 },
    rakeback: { type: Double, default: 0 },
    currencies: {
      coins: {
        current: { type: Double, default: 0.0 },
        total: { type: Double, default: 0.0 },
      },
      gems: {
        current: { type: Double, default: 0 },
        total: { type: Double, default: 0 },
      },
    },
    games: {
      dice: {
        stats: { type: [Double], default: [0, 0, 0, 0] },
        earnings: {
          current: { type: Double, default: 0.0 },
          total: { type: Double, default: 0.0 },
        },
      },
    },
    upgrades: {
      ability: {
        idleboost: {
          current: { type: Number, default: 0 },
          max: { type: Number, default: 10 },
        },
        cheapergems: {
          current: { type: Number, default: 0 },
          max: { type: Number, default: 10 },
        },
        rakeback: {
          current: { type: Number, default: 0 },
          max: { type: Number, default: 10 },
        },
        gemlimit: {
          current: { type: Number, default: 0 },
          max: { type: Number, default: 10 },
        },
      },
      gem: {
        limit: {
          current: { type: Number, default: 0 },
          max: { type: Number, default: 10 },
        },
        effect: {
          current: { type: Number, default: 0 },
          max: { type: Number, default: 10 },
        },
      },
    },
    lastCheck: { type: String, default: new Date() },
  },
  { collection: collectionName }
)

module.exports = mongoose.model(collectionName, schema)
