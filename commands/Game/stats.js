const { getPlayer } = require('../../scripts/helpers/database')
const Calc = require('../../scripts/helpers/calc')
const Convert = require('../../scripts/helpers/conversions')

module.exports = {
  name: 'stats',
  description: '',
  aliases: [],
  disabled: false,
  admin: false,
  execute: async (client, message, args) => {
    // Get Player and Do Checks
    const player = await getPlayer(message)
    if (!player) return

    let level = player.level
    let coins = await Convert.decimalDisplay(player.currencies.coins.current)
    let gems = await Convert.wholeDisplay(player.currencies.gems.current)
    let hourlyRate = await Convert.decimalDisplay(await Calc.getHourlyRate(player))
    let levelUpCost = await Convert.decimalDisplay(await Calc.getLevelUpCost(player.level))
    let idleCoinsNeededForGem = await Convert.decimalDisplay(await Calc.getIdleCoinsNeeded(player))
    let gemsEarned = await Convert.wholeDisplay(await Calc.getEarnedGems(player))

    const statsEmbed = {
      color: 0x0099ff,
      author: {
        name: 'Player Statistics',
      },
      // description: 'A basic overview of your currencies, stats, and more.',
      thumbnail: {
        url: message.author.displayAvatarURL(),
      },
      fields: [
        {
          name: ':crossed_swords: Player Level',
          value: '` ' + level + ' `',
          inline: true,
        },
        {
          name: ':coin: Coins',
          value: '` ' + coins + ' `',
          inline: true,
        },
        {
          name: ':gem: Gems',
          value: '` ' + gems + ' `',
          inline: true,
        },
        {
          name: ':alarm_clock: Hourly Rate',
          value: '` ' + hourlyRate + ' / hr' + ' `',
          inline: true,
        },
        {
          name: ':arrow_double_up:  Level Up Cost',
          value: '` ' + levelUpCost + ' `',
          inline: true,
        },
        { name: '\u200B', value: '\u200B', inline: true },
        {
          name: 'Class',
          value: player.class ? player.class.charAt(0).toUpperCase() + player.class.slice(1) : 'None',
          inline: true,
        },
        {
          name: 'Idle Coins until Next Gem',
          value: ':coin:`' + idleCoinsNeededForGem + '`',
          inline: true,
        },
        { name: '\u200B', value: '\u200B', inline: true },
        {
          name: 'Ready to prestige?',
          value: 'You will earn :gem: `' + gemsEarned + '`.',
          inline: false,
        },
      ],
      footer: {
        text: 'If you are ready to level up, do !levelup. This improves your idle rate. If you are ready to prestige, do !prestige.',
      },
    }
    message.reply({ embeds: [statsEmbed] })
    return
  },
}
