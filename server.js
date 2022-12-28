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
afterConnection = () => {
  console.log("|---------------------------------|")
  console.log("|                                 |")
  console.log("|                                 |")
  console.log("|        EMPLOYEE MANAGER         |")
  console.log("|                                 |")
  console.log("|                                 |")
  console.log("-----------------------------------")
  promptUser();
};

//Main prompt
const promptUser = () => {
  inquirer.prompt ([
    {
      type: 'list',
      name: 'input', 
      message: 'What would you like to do?',
      choices: ['View all departments', 
                'View all roles', 
                'View all employees', 
                'Add a department', 
                'Add a role', 
                'Add an employee', 
                'Update an employee role',
                'Update an employee manager',
                'View employees by department',
                'Delete a department',
                'Delete a role',
                'Delete an employee',
                'View department budgets',
                'No Action']
    }
  ])
    .then((answers) => {
      const { input } = answers; 

      if (input === "View all departments") {
        showDepartments();
      }

      if (input === "View all roles") {
        showRoles();
      }

      if (input === "View all employees") {
        showEmployees();
      }

      if (input === "Add a department") {
        addDepartment();
      }

      if (input === "Add a role") {
        addRole();
      }

      if (input === "Add an employee") {
        addEmployee();
      }

      if (input === "Update an employee role") {
        updateEmployee();
      }

      if (input === "Update an employee manager") {
        updateManager();
      }

      if (input === "View employees by department") {
        employeeDepartment();
      }

      if (input === "Delete a department") {
        deleteDepartment();
      }

      if (input === "Delete a role") {
        deleteRole();
      }

      if (input === "Delete an employee") {
        deleteEmployee();
      }

      if (input === "View department budgets") {
        viewBudget();
      }

      if (input === "No Action") {
        connection.end()
    };
  });
};

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