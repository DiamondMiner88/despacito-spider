const Discord = require('discord.js');

module.exports = {
  command: 'meme',
  category: require('./_CATEGORIES.js').fun,
  help_name: `:joy: Memes`,
  help_description: `Get a meme from r/memes`,
  usage: `meme`,
  guildOnly: false,
  unlisted: false,

  /**
   * Displays a meme from r/memes
   * @param {Discord.Message} message
   */
  execute(message) {
    require('../reddit.js').getTopPost(message, 'memes');
  }
};
