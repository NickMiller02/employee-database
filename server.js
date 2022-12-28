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

connection.connect(err => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadID}`);
    afterConnection();
})

//After connection terminal view
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

  //SQL to show the departments in table data
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

  //SQL to show the roles in table data
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
  //SQL to show the employees with their personal data in table data
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
addDepartment = () => {
  inquirer.prompt([
    {
      type: 'input', 
      name: 'addDept',
      message: "What department do you want to add?",
      validate: addDept => {
        if (addDept) {
            return true;
        } else {
            console.log('Please enter a department');
            return false;
        }
      }
    }
  ])
  //SQL to add new department data into the table values
    .then(answer => {
      const sql = `INSERT INTO department (name)
                  VALUES (?)`;
      connection.query(sql, answer.addDept, (err, result) => {
        if (err) throw err;
        console.log(`${answer.addDept} was added to departments!`); 

        showDepartments();
    });
  });
};

//Add role prompt
addRole = () => {
  inquirer.prompt([
    {
      type: 'input', 
      name: 'role',
      message: "What role do you want to add?",
      validate: addRole => {
        if (addRole) {
            return true;
        } else {
            console.log('Please enter a role');
            return false;
        }
      }
    },
    {
      type: 'input', 
      name: 'salary',
      message: "What is the salary of this role?",
      validate: addSalary => {
        if (isNAN(addSalary)) {
            return true;
        } else {
            console.log('Please enter a salary');
            return false;
        }
      }
    }
  ])
    .then(answer => {
      const params = [answer.role, answer.salary];

      //Grabs the department from the Department table
      const roleSql = `SELECT name, id FROM department`; 

      connection.promise().query(roleSql, (err, data) => {
        if (err) throw err; 
    
        const dept = data.map(({ name, id }) => ({ name: name, value: id }));

        inquirer.prompt([
        {
          type: 'list', 
          name: 'dept',
          message: "What department is this role in?",
          choices: dept
        }
        ])
          .then(deptChoice => {
            const dept = deptChoice.dept;
            params.push(dept);
            //SQL to add new role data into the table values
            const sql = `INSERT INTO role (title, salary, department_id)
                        VALUES (?, ?, ?)`;

            connection.query(sql, params, (err, result) => {
              if (err) throw err;
              console.log(`${answer.role} was added to roles!`); 

              showRoles();
       });
     });
   });
 });
};

//Add employee prompt
addEmployee = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'fistName',
      message: "What is the employee's first name?",
      validate: addFirst => {
        if (addFirst) {
            return true;
        } else {
            console.log('Please enter a first name');
            return false;
        }
      }
    },
    {
      type: 'input',
      name: 'lastName',
      message: "What is the employee's last name?",
      validate: addLast => {
        if (addLast) {
            return true;
        } else {
            console.log('Please enter a last name');
            return false;
        }
      }
    }
  ])
    .then(answer => {
    const params = [answer.fistName, answer.lastName]

    //Grabs the roles from the Roles table
    const roleSql = `SELECT role.id, role.title FROM role`;
  
    connection.promise().query(roleSql, (err, data) => {
      if (err) throw err; 
      
      const roles = data.map(({ id, title }) => ({ name: title, value: id }));

      inquirer.prompt([
            {
              type: 'list',
              name: 'role',
              message: "What role will the employee fulfill?",
              choices: roles
            }
          ])
            .then(roleChoice => {
              const role = roleChoice.role;
              params.push(role);

              const managerSql = `SELECT * FROM employee`;

              connection.promise().query(managerSql, (err, data) => {
                if (err) throw err;

                const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));

                inquirer.prompt([
                  {
                    type: 'list',
                    name: 'manager',
                    message: "Who will be the employee's manager?",
                    choices: managers
                  }
                ])
                  .then(managerChoice => {
                    const manager = managerChoice.manager;
                    params.push(manager);
                    //SQL to add new employee data with manager's data into the employee table
                    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                    VALUES (?, ?, ?, ?)`;

                    connection.query(sql, params, (err, result) => {
                    if (err) throw err;
                    console.log("The employee has been added to the database!")

                    showEmployees();
              });
            });
          });
        });
     });
  });
};

//Update employee prompt

//Update manager prompt

//View employee by department

//Delete department prompt

//Delete role prompt

//Delete employee prompt

//View budget prompt