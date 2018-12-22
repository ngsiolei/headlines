'use strict';

const fetchHeadlines = require('./fetch.js');
const parseHeadlines = require('./parse.js');
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1);
let date = today.getDate();
const yearMonth = [year, 1 === month.length ? '0' + month : month].join('-');
date = 1 === date.length ? '0' + date : date;

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
  });
});
