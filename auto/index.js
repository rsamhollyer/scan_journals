const SlackBot = require('slackbots');
const { slackBotKey } = require('../config');

const bot = new SlackBot({
  token: slackBotKey,
  name: 'AlertBot',
});

module.exports = bot;
