const fs = require('node:fs');
const getAllFiles = require('../helpers/getAllFiles');

module.exports = async (client) => {
    console.log("\nLoading up the commands...")
    
    const files = await getAllFiles('commands')
    
    // Add each command from files
    for (let i = 0; i < files.length; i++) {
        // Get file
        let file = files[i]

        // Get data from file
        const command = require(`../../${file}`)

        // Ignore if disabled
        if (!command.disabled) {
            // Add the command to the collection
            client.commands.set(command.name.toLowerCase(), command)

            // Adds the aliases
            for (let j = 0; j < command.aliases.length; j++) {
                client.aliases.set(command.aliases[j].toLowerCase(), command)
            }

            // Logging for devs
            console.log(`${"\x1b[32m"}${command.name.toLowerCase()}${"\x1b[0m"}`)
        } else {
            // Logging for devs
            console.log(`${"\x1b[31m"}${command.name.toLowerCase()}${"\x1b[0m"}`)
        }

        // Delete the import cache for optimization
        delete require.cache[require.resolve(`../../${file}`)];
    }
}