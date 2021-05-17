const app = require('express')();
const axios = require('axios');
const cheerio = require('cheerio');

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
  console.log(allLinks);
};

const go = async () => {
  getJournals(await getGithub('https://github.com/sarahdepalo/journal'));
};
go();
