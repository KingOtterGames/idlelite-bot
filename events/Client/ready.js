const config = require('../../config')

module.exports = (client) => {
    // Logging for devs 
    console.log(`\nClient logged into ${"\x1b[34m"}${client.user.username}#${client.user.discriminator}${"\x1b[0m"}. Currently ready on ${"\x1b[31m"}${client.guilds.cache.size} servers${"\x1b[0m"} for ${"\x1b[33m"}${client.users.cache.size} users${"\x1b[0m"}.`)
    console.log(`\nNow logging events...`)
    // Set the discord bots activity to what's in the config
    client.user.setActivity(config.presenceMessage)
}