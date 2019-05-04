'use strict';

const args = require('minimist')(process.argv.slice(2));

let year = null;
let month = null;
let date = null;

Object.keys(args).forEach(k => {
  switch (k) {
    case 'year':
    case 'y':
      year = parseInt(args[k], 10);
      break;
    case 'month':
    case 'm':
      month = parseInt(args[k], 10);
      break;
    case 'date':
    case 'd':
      date = parseInt(args[k], 10);
      break;
    case 'h':
      printHelp();
      process.exit();
    default:
  }
});

if (year !== null && isNaN(year)) {
  console.error('Invalid year!');
  printHelp();
  process.exit(1);
}
if (month !== null && isNaN(month)) {
  console.error('Invalid month!');
  printHelp();
  process.exit(1);
}
if (date !== null && isNaN(date)) {
  console.error('Invalid date!');
  printHelp();
  process.exit(1);
}
if (year === null && month === null && date === null) {
  const today = new Date();
  year = today.getFullYear();
  month = today.getMonth() + 1;
  date = today.getDate();
} else if (year === null || month === null || date === null) {
  console.error('Invalid arguments!');
  printHelp();
  process.exit(1);
}
year = String(year);
month = String(month);
date = String(date);
const yearMonth = [year, 1 === month.length ? '0' + month : month].join('-');
date = 1 === date.length ? '0' + date : date;
const fetchHeadlines = require('./fetch.js');
const parseHeadlines = require('./parse.js');

fetchHeadlines(yearMonth, date, (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  parseHeadlines(yearMonth, date, data, (err, obj) => {
    if (err) {
      console.error(err);
      return;
    }
    if (obj.items && obj.items.length > 0) {
      obj.items.forEach(x => {
        console.log([x.cat, x.title, x.link].join(' | '));
      });
      return;
    }
    console.error('Something wrong!');
  });
});

function printHelp() {
  console.log('Usage: node index -y year -m month -d date');
  console.log('Example: node index -y 2019 -m 5 -d 4');
}
