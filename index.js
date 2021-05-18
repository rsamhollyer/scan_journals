const http = require('http');
const express = require('express');
const logger = require('morgan')('dev');

const app = express();
const server = http.createServer(app);
const axios = require('axios');
const cheerio = require('cheerio');

const HOST = 'localhost';
const PORT = 4834;
app.use(logger);
const getGithub = async (url) => {
  const { data: html } = await axios.get(url);
  return html;
};

const getJournals = async (html) => {
  const allLinks = [];
  const $ = cheerio.load(html, false);
  const links = $('[data-pjax="#repo-content-pjax-container"]');
  links.each((_, el) => {
    allLinks.push({
      text: $(el).text(),
      href: $(el).attr('href'),
    });
  });
  return allLinks;
};

const go = async () => {
  const data = await getJournals(
    await getGithub('https://github.com/sarahdepalo/journal')
  );
  return data;
};

app.get('/', (req, res) => {
  res.send('HI!');
});

app.get('/scrape', async (req, res, next) => {
  console.log(`SCRAPING!`);
  const stuff = await go();
  res.json(stuff);
});

server.listen(PORT, HOST, () => {
  console.log(`App listening on http://${HOST}:${PORT}`);
});
