module.exports = {
    name: 'ping',
    description: '',
    aliases: ['p'],
    disabled: false,
    admin: false,
    execute: async (client, message, args) => {
        message.reply('Pong!')
    }
}