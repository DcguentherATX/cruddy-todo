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
    } 
    callback(null, fileArray);
  });
}; 

exports.readOne = (id, callback) => { 
  let path = `${exports.dataDir}/${id}.txt`; 
  // console.log(`${exports.dataDir}/${id}`) 

  // utf8, prevents the return of a buffer. 
  fs.readFile(path, 'utf8', (err, todoFile) => { 
    if (err) { 
      callback(err, `file does not exist`); 
    } else { 
      let fileObj = {
        id: id,
        text: todoFile
      }; 
      callback(null, fileObj); 
    }
  });
};

exports.update = (id, text, callback) => {
  let path = `${exports.dataDir}/${id}.txt`; 

  fs.readFile(path, 'utf8', (err) => { 
    if (err) { 
      callback (err, `invalid index`);
    } else { 
      fs.writeFile(path, text, (err) => { 
        // console.log(path, `file from readFile to write`)
        if (err) { 
          throw (err, `error saving todo`); 
        } else { 
          callback(null, { id, text}); 
        }
      }); 
    }
  }); 
  // callback(null, { id, text });
};

exports.delete = (id, callback) => {
  let path = `${exports.dataDir}/${id}.txt`; 
  fs.unlink(path, (err) => { 
    // console.log(path, `file from readFile to write`)
    if (err) { 
      callback (err, `error saving todo`); 
    } else { 
      callback(null); 
    }
  }); 
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
