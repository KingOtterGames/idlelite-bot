const config = require('../../config')

module.exports = async (message) => {
    // Check to make sure the global variable is set for Client
    if (!global.client) return

    // Don't run code if message is a bot
    if (message.author.bot) return

    // Check prefix
    if (message.content[0] !== config.commandPrefix) return

    // Remove prefix and tokenize command
    let args = message.content.slice(1).split(' ')

    // Find command
    let command = global.client.commands.get(args[0])
    let alias = global.client.aliases.get(args[0])

    // Check if valid command
    if (!command && !alias) return

    // Check for proper permissions
    if (command.admin) {
        // Get users admin permission
        const isAdmin = await message.member.permissions.has('ADMINISTRATOR')

        // Exit command, as they are not an admin
        if (!isAdmin) return
    }

    // Log Command
    console.log(`${"\x1b[32m"}Command: ${"\x1b[0m"}${config.commandPrefix}${args[0]} (${message.author.username}#${message.author.discriminator})`)

    // Execute command
    if (command) {
        await command.execute(global.client, message, args.slice(1))
    } else {
        await alias(global.client, message, args.slice(1))
    }
}