DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS departments;
CREATE TABLE IF NOT EXISTS departments (
    id serial PRIMARY KEY,
    department_name varchar(64) NOT NULL
);
CREATE TABLE IF NOT EXISTS employees (
    id serial PRIMARY KEY,
    name varchar(64) NOT NULL,
    salary numeric(8, 2) NOT NULL CHECK (salary >= 0),
    department_id int REFERENCES departments
);