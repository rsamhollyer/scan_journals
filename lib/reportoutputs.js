const fs = require('fs');
const path = require('path');

function createReportObject(name, expect, total = 0) {
  const reportObj = {};
  reportObj[name] = { expect, total, missing: expect - total };
  return reportObj;
}
function readableReport(array) {
  const headerString =
    '🤖 - As of today, the following students are missing at least 1 journal entry :\n\n\n\n';
  const reportString = array.reduce((acc, cur) => {
    const name = Object.keys(cur);
    const { expect } = cur[name];
    const { missing } = cur[name];
    const englishSyntax = missing > 1 ? 'entries' : 'entry';
    const newString = `${name} is missing ${missing} journal ${englishSyntax} out of a required ${expect}.\n\n`;
    return acc + newString;
  }, headerString);
  return reportString;
}

function generateReport() {
  const jsonPath = path.resolve(__dirname, '../db/db.json');
  const response = () => fs.readFileSync(jsonPath, { encoding: 'utf8' });
  const data = JSON.parse(response());
  console.log(JSON.stringify(data));
  const reportArray = [];
  const studentData = Object.keys(data?.students);
  const expectedReports = data?.expectedEntries;

  studentData.forEach((s) => {
    const total = data?.students[s]?.total || 0;
    if (total < expectedReports) {
      reportArray.push(createReportObject(s, expectedReports, total));
    }
  });
  const report = readableReport(reportArray);
  return report;
}
module.exports = { generateReport };
