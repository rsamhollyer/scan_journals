const axios = require('axios');
const cheerio = require('cheerio');

async function getGithub(url) {
  const { data: html } = await axios.get(url);
  return html;
}

async function createObjects(student, cheerioLinks) {
  const userObj = {};

  userObj[student] = { repos: cheerioLinks, total: cheerioLinks.length };
  return userObj;
}
async function getJournals(student, html) {
  const $ = cheerio.load(html, false);
  const links = $('[data-pjax="#repo-content-pjax-container"]');
  const allLinks = [];
  links.each((_, el) => {
    allLinks.push({
      text: $(el).text(),
      href: $(el).attr('href'),
    });
  });

  const userScrape = createObjects(student, allLinks);
  return userScrape;
}

async function go(studentObject) {
  const students = {};
  for (const key of Object.keys(studentObject)) {
    if (studentObject[key] === null) {
      const nullData = {};
      const name = `${key}`;
      nullData[name] = null;
      Object.assign(students, nullData);
    } else {
      const data = await getJournals(key, await getGithub(studentObject[key]));
      Object.assign(students, data);
    }
  }
  return students;
}

module.exports = go;
