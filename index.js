const createJob = require('./lib/cron');
const bot = require('./auto');

bot.on('start', () => {
  bot.postMessageToChannel('our-marriage', '🤖 AlertBot starting...');
  createJob();
});
