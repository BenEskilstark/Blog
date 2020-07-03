
const {
  getPostgresClient,
  writeQuery,
  selectQuery,
  updateQuery,
} = require('./dbUtils');

const setVisit = (url) => {
  updateQuery(
    'visits',
    {
      num_visits: 'num_visits + 1',
      last_visited: 'current_timestamp',
    },
    {site: url},
  );
}


module.exports = {
  setVisit,
}


