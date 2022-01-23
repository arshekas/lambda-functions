const sql = require('./db.js');

// constructor
const User = function (user) {
  this.username = user.username;
  this.kills = user.kills;
  this.deaths = user.deaths;
  this.assists = user.assists;
  this.accuracy = user.accuracy;
  this.wins = user.wins;
  this.loses = user.wins;
};

User.findById = (id, result) => {
  sql.query(`SELECT * FROM users WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log('found user: ', res[0]);
      result(null, res[0]);
      return;
    }

    // not found User with the id
    result({ kind: 'not_found' }, null);
  });
};

User.getAll = (title, result) => {
  let query = 'SELECT * FROM users';

  if (title) {
    query += ` WHERE title LIKE '%${title}%'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }

    console.log('users: ', res);
    result(null, res);
  });
};

module.exports = User;
