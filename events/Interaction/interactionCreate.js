const config = require('../../config')

module.exports = async (interaction) => {
    // Look for button interactions
	if (!interaction.isButton()) return;

    // Find action
    let action = global.client.buttonActions.get(interaction.customId) 

    // Check if valid button action
    if (!action) return

    // Log Command
    console.log(`▶ Button: ${interaction.customId} (${interaction.user.username}#${interaction.user.discriminator})`)

    // Execute the button action
    await action(global.client, interaction)
}