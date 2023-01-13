const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: 'button',
    description: '',
    aliases: ['b'],
    disabled: false,
    admin: false,
    execute: async (client, message, args) => {
        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('exampleClick')
                .setLabel('Click Me')
                .setStyle('PRIMARY'),
        );

        await message.reply({ content: 'A button example command', components: [row] });
    }
}