const mongoose = require('mongoose')

const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

const connect = () => {
  const url = process.env.DATABASE_URL
  mongoose
    .connect(url, connectionParams)
    .then(() => {
      console.log('Connected to the database ')
    })
    .catch((err) => {
      console.error(`Error connecting to the database. n${err}`)
    })
}

const get = () => {
  return mongoose
}

const Db = {
  connect,
  get,
}

module.exports = Db
