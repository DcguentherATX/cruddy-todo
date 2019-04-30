const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

// exports.create = (text, callback) => {
//   var id = counter.getNextUniqueId();
//   items[id] = text;
//   callback(null, { id, text });
// };
exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => { 
    if (err) { 
      throw (err, `create func, get id error`); 
    } else { 
      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => { 
        if (err) { 
          throw (err, `error writing file during create.`);
        } else {
          callback(null, { id, text });
          // console.log(`${exports.dataDir}/${id}.txt`)
        }
      });
    }
  });
}; 

exports.readAll = (callback) => {
  let path = exports.dataDir;
  let fileArray = [];

  fs.readdir(path, (err, ids) => { 
    if (err) { 
      throw (err, `readdir error`); 
    } else { 
      for (let i = 0; i < ids.length; i++) {
        let id = ids[i].slice(0, 5);
        let fileObj = {
          id: id,
          text: id
        }; 
        fileArray.push(fileObj);
      } 
      callback(null, fileArray);
      console.log(`read All`, fileArray);
    }
  });


  var data = _.map(items, (text, id) => {
    return { id, text };
  });
  callback(null, data);
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
