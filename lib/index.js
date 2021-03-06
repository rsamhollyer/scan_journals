const axios = require('axios');
const cheerio = require('cheerio');
const moment = require('moment');
const data = require('../db/db.json');
const db = require('../db/db');

async function getGithub(url) {
  const { data: html } = await axios.get(url);
  return html;
}

async function createObjects(student, cheerioLinks) {
  const userObj = {};
  if (
    data.students[student] &&
    cheerioLinks.length === data.students[student].total
  ) {
    userObj[student] = data.students[student];
  } else {
    userObj[student] = {
      repos: cheerioLinks,
      total: cheerioLinks.length,
      updatedData: moment(),
    };
  }
  return userObj;
}
async function getJournals(student, html) {
  const $ = cheerio.load(html, false);
  const links = $('[data-pjax="#repo-content-pjax-container"]');
  const allLinks = [];
  links.each((_, el) => {
    if (
      !$(el).text().toLowerCase().includes('readme') &&
      $(el).text().includes('.md')
    )
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
      const scrapeData = await getJournals(
        key,
        await getGithub(studentObject[key])
      );
      Object.assign(students, scrapeData);
    }
  }
  return students;
}

// Checks the data.json object for expected number of entries. This assumes that Monday is the day of the week when a new entry should be added to the attrbute 'expectedEntries' in json file.

function checkExpectedEntries() {
  if (moment().format('dddd') === 'Sunday') {
    db.update('expectedEntries', (n) => n + 1).write();
  }
}

module.exports = { go, checkExpectedEntries };
