
const {Client} = require('pg');


// -------------------------------------------------------------------------
// Queries
// -------------------------------------------------------------------------

const writeQuery = (table, row, pgClient) => {
  const valuesStr = toValuesStr(row);
  const queryStr = `INSERT INTO ${table} ${valuesStr}`;
  return queryPostgres(queryStr, 'write', pgClient);
};


const deleteQuery = (table, filters, pgClient) => {
  const filterStr = toFilterStr(filters);
  const queryStr = `DELETE FROM ${table} ${filterStr}`;
  return queryPostgres(queryStr, 'write', pgClient);
};


const selectQuery = (table, columns, filters, pgClient, orderBy) => {
  const selectStr = `SELECT ${columns.join(', ')} FROM ${table}`;
  const filterStr = toFilterStr(filters, orderBy);
  const queryStr = `${selectStr} ${filterStr}`;
  return queryPostgres(queryStr, 'readOnly', pgClient);
};


const updateQuery = (table, row, filters, pgClient) => {
  const setStr = toUpdateStr(row);
  const filterStr = toFilterStr(filters);
  const queryStr = `UPDATE ${table} ${setStr} ${filterStr}`;
  return queryPostgres(queryStr, 'write', pgClient);
};


// -------------------------------------------------------------------------
// Helpers
// -------------------------------------------------------------------------

const getPostgresClient = () => {
  const port = process.env.PORT || 8000;
  const settings = port == 8000
    ? {database: 'postgres'}
    : {
        connectionString: process.env.DATABASE_URL,
        ssl: {rejectUnauthorized: false},
    };
  const client = new Client(settings);
  // TODO: can you connect/end the same client multiple times?
  return client;
};


// returns the query as a promise
const queryPostgres = (queryStr, readMode, pgClient) => {
  const client = pgClient != null ? pgClient : getPostgresClient();
  client.connect();
  if (readMode == 'readOnly' || readMode == 'readonly' || readMode == 'read only') {
    client.query('SET SESSION CHARACTERISTICS AS TRANSACTION READ ONLY;', () => {});
  }
 return  client.query(queryStr)
  .then(
    (res) => {
      if (pgClient == null) client.end();
      return res;
    },
    (err) => {
      if (pgClient == null) client.end();
      console.error('error for query: ', queryStr);
      console.error(err);
      throw err;
    },
  );
}


// convert filters json into sql where conditions
const toFilterStr = (filters, orderBy) => {
  let filterStr = ' ';
  const cols = Object.keys(filters);
  for (let i = 0; i < cols.length; i++) {
    if (i == 0) {
      filterStr += 'WHERE ';
    }
    const col = cols[i];
    filterStr += col + "='" + filters[col] + "'";
    if (i < cols.length - 1) {
      filterStr += ' AND ';
    }
  }
  if (orderBy != null) {
    filterStr += ` ORDER BY ${orderBy} ASC`;
  }

  return filterStr;
}

const toValuesStr = (row) => {
  let columnStr = '';
  let valueStr = '';
  const cols = Object.keys(row);
  for (let i = 0; i < cols.length; i++) {
    columnStr += cols[i];
    let value = row[cols[i]];
    if (value != (parseFloat(value))) {
      value = "'" + value + "'";
    }
    valueStr += value;
    // valueStr += "'" + row[cols[i]] + "'";
    if (i < cols.length - 1) {
      columnStr += ', ';
      valueStr += ', ';
    }
  }

  return `(${columnStr}) VALUES (${valueStr})`;
}

const toUpdateStr = (row) => {
  let setStr = '';
  const cols = Object.keys(row);
  for (let i = 0; i < cols.length; i++) {
    if (i == 0) {
      setStr += 'SET ';
    }
    const col = cols[i];
    setStr += col + "=" + row[col];
    if (i < cols.length - 1) {
      setStr += ', ';
    }
  }
  return setStr;
}


module.exports = {
  getPostgresClient,
  writeQuery,
  selectQuery,
  updateQuery,
  deleteQuery,
}
