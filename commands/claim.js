module.exports = {
  command: 'claim',
  category: require('./_CATEGORIES.js').oofcoin,
  help_name: `Claim your daily coins!`,
  help_description: `Claim your daily coins! Available once every 24 hours.`,
  usage: `claim`,
  guildOnly: false,
  unlisted: false,

  execute(client, message, args) {
    require('../oofcoin.js').checkForProfile(message.author);
    message.channel.send('This command has not been implemented yet!');
  }
};
