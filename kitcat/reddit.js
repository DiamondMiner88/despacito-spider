const Discord = require('discord.js');
const snoowrap = require('snoowrap');
const config = require('./config/config.json');
const fetch = require('node-fetch');
const { Subreddit } = require('snoowrap');

const reddit = new snoowrap({
  userAgent: config.reddit_user_agent,
  clientId: config.reddit_client_id,
  clientSecret: config.reddit_client_secret,
  username: config.reddit_username,
  password: config.reddit_password
});

let id_list = {
  guilds: {},
  dms: {}
};
let reddit_idlist_starttime = new Date().getTime();

/**
 * Gets the top post of a subreddit that has not been gotten yet for the guild
 * @param {Discord.TextChannel} message
 * @param {String} subreddit_name
 */
async function getTopPost(message, subreddit_name) {
  // Reset list if its been 24 hrs
  if (new Date().getTime() - 86400000 >= reddit_idlist_starttime) {
    reddit_idlist_starttime = new Date().getTime();
    id_list = {
      guilds: {},
      dms: {}
    };
  }

  if (message.channel.type !== 'dm') {
    let isOver18 = await fetch(`https://api.reddit.com/r/${subreddit_name}/about`);
    isOver18 = await isOver18.json();

    if (isOver18.data.over18 && !message.channel.nsfw)
      return message.channel.send(
        'The subreddit you chose is 18+. Run this command in a NSFW channel to get the posts.'
      );
    else {
      if (!id_list.guilds[message.guild.id]) id_list.guilds[message.guild.id] = [];

      const subreddit = await reddit.getSubreddit(subreddit_name);

      const topPosts = await subreddit.getTop({
        limit: 100
      });

      let postToUse;

      for (const submission of topPosts) {
        if (!id_list.guilds[message.guild.id].includes(submission.id)) {
          postToUse = submission;
          id_list.guilds[message.guild.id].push(submission.id);
          break;
        }
      }

      if (postToUse.over_18 && !message.channel.nsfw)
        return message.channel.send(
          'Post is NSFW while the channel is not. Getting a new one, please hold on...'
        );

      sendPost(message, postToUse);
    }
  }
  else {
    if (!id_list.dms[message.author.id]) id_list.dms[message.author.id] = [];

      const subreddit = await reddit.getSubreddit(subreddit_name);

      const topPosts = await subreddit.getTop({
        limit: 100
      });
      
      let postToUse;

      for (const submission of topPosts) {
        if (!id_list.dms[message.author.id].includes(submission.id)) {
          postToUse = submission;
          id_list.dms[message.author.id].push(submission.id);
          break;
        }
      }

      if (postToUse.over_18 && !message.channel.nsfw)
        return message.channel.send(
          'Post is NSFW while the channel is not. Getting a new one, please hold on...'
        );

      sendPost(message, postToUse);
  }
}

function sendPost(message, post) {
  let embed = new Discord.MessageEmbed()
    .setColor('white')
    .setAuthor(`u/${post.author.name}`)
    .setTitle(post.title)
    .setURL(`https://reddit.com${post.permalink}`)
    .setImage(post.url)
    .setFooter(
      `👍 ${(Math.round(post.score / 1000) * 1000).toString().slice(0, -3)}k`
    )
    .setTimestamp(new Date(post.created_utc * 1000));
  message.channel.send(embed);
}

// function linkImagesFromPosts(message) {
//   let redditThreadRegex = /https?:\/\/www.reddit.com\/r\/.+?(?=\/)\/comments\/.+?(?=\/)\/.+/g;
//   if (message.content.match(redditThreadRegex)) {
//     // TODO: connect to reddit, get the thread from url and post the content on discord
//   }
// }

module.exports = {
  getTopPost
};
