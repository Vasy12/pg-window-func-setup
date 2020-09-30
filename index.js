const { promises } = require('fs');
const path = require('path');
const dbConfig = require('./configs/db.json');
const { Client } = require('pg');
const axios = require('axios');
const _ = require('lodash');

const client = new Client(dbConfig);

(async () => {
  await client.connect();
  const resetSql = (
    await promises.readFile(path.resolve(__dirname, './sql/reset.pgsql'))
  ).toString();
  await client.query(resetSql);

  // DEPARTMENTS PART
  const departments = ['HR', 'SALES', 'MARKETING', 'DEVELOP'];

  const {
    rows: departmentsIds,
  } = await client.query(`INSERT INTO departments ("department_name")\n
  VALUES ${departments.map(d => `('${d}')`).join()} RETURNING id;`);
  // EMPLOYEES PART

  const {
    data: { results: employees },
  } = await axios.get(
    'https://randomuser.me/api/?results=100&inc=name&seed=employees'
  );

  await client.query(`INSERT INTO employees ("name", "department_id", "salary")\n
  VALUES ${employees
    .map(
      ({ name: { first, last } }) =>
        `('${`${first} ${last}`}',${
          departmentsIds[_.random(0, departmentsIds.length - 1, false)].id
        }, ${_.random(100000, 999999)})`
    )
    .join()};`);

  await client.end();
})();
