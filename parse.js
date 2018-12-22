'use strict';

const htmlparser = require('htmlparser2');

const parseHeadlines = (yearMonth, date, data, cb) => {
  let items = [];
  let depth = 0;
  let nodeDepth = null;
  let contentDepth = null;
  let currentCat = null;
  const createItem = () => {
    return {
      title: '',
      link: '',
      cat: '',
    };
  };
  const isNodeLink = link => {
    const re = /node_/;
    return null !== link.match(re);
  };
  const isContentLink = link => {
    const re = /content_/;
    return null !== link.match(re);
  };
  let pendingItem = createItem();
  const parser = new htmlparser.Parser(
    {
      onopentag: (name, attrs) => {
        switch (name) {
          case 'a':
            if (attrs.href) {
              if (isNodeLink(attrs.href)) {
                nodeDepth = depth;
              } else if (isContentLink(attrs.href)) {
                contentDepth = depth;
                pendingItem.link =
                  `http://macaodaily.com/html/${yearMonth}/${date}/` +
                  attrs.href;
              }
            }
            break;
        }
        depth++;
      },
      ontext: text => {
        if (nodeDepth && nodeDepth < depth) {
          currentCat = text;
        }
        if (contentDepth && contentDepth < depth) {
          pendingItem.title = text;
          pendingItem.cat = currentCat;
        }
      },
      onclosetag: name => {
        if (nodeDepth && nodeDepth >= depth) {
          nodeDepth = null;
        }
        if (contentDepth && contentDepth >= depth) {
          items.push(pendingItem);
          pendingItem = createItem();
          contentDepth = null;
        }
        depth--;
      },
      onend: () => {
        cb(null, {items});
      },
    },
    {decodeEntities: true},
  );
  parser.write(data);
  parser.end();
};

module.exports = parseHeadlines;
