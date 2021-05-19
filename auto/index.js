const SlackBot = require('slackbots');
const { slackBotKey } = require('../config');

const bot = new SlackBot({
  token: slackBotKey,
  name: 'AlertBot',
});

bot.on('start', () => {
  bot.postMessageToChannel('our-marriage', 'AlertBot starting...');
});
