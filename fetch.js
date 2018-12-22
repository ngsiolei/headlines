'use strict';

const http = require('http');
const fs = require('fs');

const fetchHeadlines = (yearMonth, date, cb) => {
  const options = {
    hostname: 'macaodaily.com',
    port: 80,
    path: `/html/${yearMonth}/${date}/node_1.htm`,
    method: 'GET',
  };
  const req = http.request(options, res => {
    let content = '';
    res.on('data', d => {
      content += d;
    });
    res.on('end', () => {
      cb(null, content);
    });
  });

  req.on('error', err => {
    console.error(err);
    cb(err);
  });

  req.end();
};

module.exports = fetchHeadlines;
