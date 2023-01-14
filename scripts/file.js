const fs = require('fs')

const read = () => {
  return JSON.parse(
    fs.readFileSync('./data/players.json', {
      encoding: 'utf8',
      flag: 'r',
    })
  )
}

const write = (data) => {
  fs.writeFileSync('./data/players.json', JSON.stringify(data), {
    encoding: 'utf8',
    mode: 0o666,
  })
}

const File = {
  read,
  write,
}

module.exports = File
