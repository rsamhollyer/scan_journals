const http = require('http');
const express = require('express');
const logger = require('morgan')('dev');

const app = express();
const server = http.createServer(app);
const axios = require('axios');
const cheerio = require('cheerio');
const db = require('./db/db.js');
const studentData = require('./student_repos/data');
// db.get('students')
//   .assign({ sam: [{}, {}, {}], count: 0 })
//   .write();

const HOST = 'localhost';
const PORT = 4834;
app.use(logger);

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
      // eslint-disable-next-line no-continue
      Object.assign(students, { key: null });
    } else {
      const data = await getJournals(key, await getGithub(studentObject[key]));
      Object.assign(students, data);
    }
    console.log(students);
  }
  return students;
}


server.listen(PORT, HOST, () => {
  console.log(`App listening on http://${HOST}:${PORT}`);
});
