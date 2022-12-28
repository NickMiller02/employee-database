//Imports
const mysql = require('mysql');
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

connection.connect(err => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadID}`);
    afterConnection();
})

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

//Show department prompt
showDepartments = () => {
  console.log('Showing all departments...\n');
  const sql = `SELECT department.id AS id, department.name AS department FROM department`; 

  connection.promise().query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    promptUser();
  });
};

//Show role prompt
showRoles = () => {
  console.log('Showing all roles...\n');

  const sql = `SELECT role.id, role.title, department.name AS department
               FROM role
               INNER JOIN department ON role.department_id = department.id`;
  
  connection.promise().query(sql, (err, rows) => {
    if (err) throw err; 
    console.table(rows); 
    promptUser();
  })
};

//Show employee prompt
showEmployees = () => {
  console.log('Showing all employees...\n'); 
  const sql = `SELECT employee.id, 
                      employee.first_name, 
                      employee.last_name, 
                      role.title, 
                      department.name AS department,
                      role.salary, 
                      CONCAT (manager.first_name, " ", manager.last_name) AS manager
               FROM employee
                      LEFT JOIN role ON employee.role_id = role.id
                      LEFT JOIN department ON role.department_id = department.id
                      LEFT JOIN employee manager ON employee.manager_id = manager.id`;

  connection.promise().query(sql, (err, rows) => {
    if (err) throw err; 
    console.table(rows);
    promptUser();
  });
};

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