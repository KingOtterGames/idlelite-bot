const { getPlayer } = require('../../scripts/helpers/database')
const Player = require('../../scripts/database/models/Player')
const SimpleEmbed = require('../../scripts/helpers/simpleEmbed')
const Check = require('../../scripts/helpers/checks')
const Calc = require('../../scripts/helpers/calc')
const AbilitiesJSON = require('../../content/Abilities.json').data
const Convert = require('../../scripts/helpers/conversions')

module.exports = {
  name: 'abilities',
  description: '',
  aliases: [],
  disabled: false,
  admin: false,
  execute: async (client, message, args) => {
    // Return with helpful information
    let sentences = [
      'Abilities give you buffs for certain things. Read more in our guide channel.',
      'You can upgrade your abilities using the !upgrade command. Something like !upgrade ability rakeback will provide more information',
      'Upgrades are persistent from the !upgrade command.',
    ]
    if (await Check.checkIfHelp(message, args, sentences, '!class', 'Classes (Help)')) return

    // Get Player and Do Checks
    const player = await getPlayer(message)
    if (!player) return

    const getLevelDisplayBar = async (current, max, ability) => {
      let str = ''
      for (let i = 0; i < max; i++) {
        if (i < current) str += '[:green_square:] '
        else str += '[:black_large_square:] '
      }

      let mod = await Calc.getAbilityModifier(player, ability)
      if (ability === 'idleboost') {
        str += '\n\n***► Effect:** ' + AbilitiesJSON['idleboost'].mod.replace('{{MOD}}', ((mod - 1) * 100).toFixed(0)) + '*'
      } else if (ability === 'rakeback') {
        str += '\n\n***► Effect:** ' + AbilitiesJSON['rakeback'].mod.replace('{{MOD}}', mod * 100) + '*'
      } else if (ability === 'cheapergems') {
        str += '\n\n***► Effect:** ' + AbilitiesJSON['cheapergems'].mod.replace('{{MOD}}', Convert.wholeDisplay(10000 - mod)) + '*'
      } else if (ability === 'gemlimit') {
        str += '\n\n***► Effect:** ' + AbilitiesJSON['gemlimit'].mod.replace('{{MOD}}', Convert.wholeDisplay(mod)) + '*'
      }
      str +=
        '\n***► Upgrade Cost:** ' +
        (current >= max ? 'Maxed out' : ':gem: ` ' + (await Calc.getAbilityUpgradeCost(current, ability)) + ' ` (!upgrade ability ' + ability + ')') +
        '*'
      return str
    }

    const exampleEmbed = {
      color: '0xfcba03',
      author: {
        name: 'Ability Upgrades',
      },
      thumbnail: {
        url: (await client.users.fetch(player.id)).displayAvatarURL(),
      },
      fields: [
        {
          name: 'IdleBoost (Level ' + player.upgrades.ability.idleboost.current + ')',
          value: await getLevelDisplayBar(player.upgrades.ability.idleboost.current, player.upgrades.ability.idleboost.max, 'idleboost'),
          inline: false,
        },
        {
          name: 'Rakeback (Level ' + player.upgrades.ability.rakeback.current + ')',
          value: await getLevelDisplayBar(player.upgrades.ability.rakeback.current, player.upgrades.ability.rakeback.max, 'rakeback'),
          inline: false,
        },
        {
          name: 'CheaperGems (Level ' + player.upgrades.ability.cheapergems.current + ')',
          value: await getLevelDisplayBar(player.upgrades.ability.cheapergems.current, player.upgrades.ability.cheapergems.max, 'cheapergems'),
          inline: false,
        },
        {
          name: 'GemLimit (Level ' + player.upgrades.ability.gemlimit.current + ')',
          value: await getLevelDisplayBar(player.upgrades.ability.gemlimit.current, player.upgrades.ability.gemlimit.max, 'gemlimit'),
          inline: false,
        },
      ],
      footer: {
        text: 'Ability upgrades are permenant and cost gems. Use !upgrade ability [abilityName] to upgrade a ability and get its cost.',
      },
    }
    message.reply({ embeds: [exampleEmbed] })
  },
}
