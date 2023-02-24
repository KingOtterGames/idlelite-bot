const Player = require('../scripts/database/models/Player')
const TimeAgo = require('javascript-time-ago')
const en = require('javascript-time-ago/locale/en')
TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US')
const commaNumber = require('comma-number')

module.exports = {
  name: 'shop',
  description: '',
  aliases: ['s'],
  disabled: false,
  admin: true,
  execute: async (client, message, args) => {
    const player = await Player.findOne({ id: message.author.id })

    let fields = []

    // Classes for Sale
    let classes = [
      { name: 'Warrior', cost: 50, desc: 'Earn a bonus on idle rates' },
      { name: 'Rogue', cost: 50, desc: 'Earn more rakeback from betting' },
      { name: 'Mage', cost: 50, desc: 'Earn gems cheaper' },
    ]

    for (let i = 0; i < classes.length; i++) {
      fields.push({
        name: 'Item',
        value: classes[i].name,
        inline: true,
      })
      fields.push({
        name: 'Cost',
        value: ':gem:`' + classes[i].cost + '`',
        inline: true,
      })
      fields.push({ name: 'Description', value: classes[i].desc, inline: true })
    }

    const exampleEmbed = {
      color: '0xfcba03',
      author: {
        name: 'Shop',
      },
      thumbnail: {
        url: (await client.users.fetch(player.id)).displayAvatarURL(),
      },
      fields: fields,
      footer: {
        text: 'Type !shop buy [itemName] to buy that item/upgrade/class.',
      },
    }
    message.reply({ embeds: [exampleEmbed] })
  },
}
