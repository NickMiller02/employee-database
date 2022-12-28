//Imports
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
require('dotenv').config();

//Connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'employee_db'
});

//Help make the connection look visible

//Main prompt

//Department prompt

//Role prompt

//Employee prompt

//Add department prompt

//Add role prompt

//Add employee prompt

//Update employee prompt

//Update manager prompt

//View employee by department

//Delete department prompt

//Delete role prompt

//Delete employee prompt

//View budget prompt