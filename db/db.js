const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('./db/db.json');
const db = low(adapter);
db.defaults({
  students: {},
  expectedEntries: 5,
  lastRun: new Date(),
}).write();

module.exports = db;
