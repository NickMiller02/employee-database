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
        switch (answers.menu) {
            case 'View all departments':
                showDepartments();
                break;
            case 'View all roles':
                showRoles();
                break;
            case 'View all employees':
                showEmployees();
                break;
            case 'View employees by department':
                employeeDepartment();
                break;
            case 'View department budgets':
                viewBudget();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmployee();
                break;
            case 'Update an employee manager':
                updateManager();
                break;
            case 'Delete a department':
                deleteDepartment();
                break;
            case 'Delete a role':
                deleteRole();
                break;
            case 'Delete an employee':
                deleteEmployee();
                break;
        }
  });
};

//Show department prompt
showDepartments = () => {
  console.log('Showing all departments...\n');

  const sql = `SELECT * FROM department`;
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message })
            return;
        }
        console.table(result);
    promptUser();
  });
};

//Show role prompt
showRoles = () => {
  console.log('Showing all roles...\n');

  //SQL to show the roles in table data
  const sql = `SELECT * FROM role`;
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message })
            return;
        }
        console.table(result); 
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
                role.title AS job_title,
                department.department_name,
                role.salary,
                CONCAT(manager.first_name, ' ' ,manager.last_name) AS manager
                FROM employee
                LEFT JOIN role ON employee.role_id = role.id
                LEFT JOIN department ON role.department_id = department.id
                LEFT JOIN employee AS manager ON employee.manager_id = manager.id
                ORDER By employee.id`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.table(result);
    promptUser();
  });
};

//Add department prompt
addDepartment = () => {
  inquirer.prompt([
    {
        name: "department_name",
        type: "input",
        message: "Please enter the name of the department you want to add to the database."
    }
    ]).then((answer) => {

    const sql = `INSERT INTO department (department_name)
                VALUES (?)`;
    const params = [answer.department_name];
    db.query(sql, params, (err, result) => {
        if (err) throw err;
        console.log('The new department entered has been added successfully to the database.');

        db.query(`SELECT * FROM department`, (err, result) => {
            if (err) {
                res.status(500).json({ error: err.message })
                return;
            }
            console.table(result);
            promptUser();
        });
    });
});
};

//Add role prompt
addRole = () => {
    inquirer.prompt([
        {
            name: "title",
            type: "input",
            message: "Please enter the title of role you want to add to the database."
        },
        {
            name: "salary",
            type: "input",
            message: "Please enter the salary associated with the role you want to add to the database. (no dots, space or commas)"
        },
        {
            name: "department_id",
            type: "number",
            message: "Please enter the department's id associated with the role you want to add to the database."
        }
    ]).then(function (response) {
        db.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [response.title, response.salary, response.department_id], function (err, data) {
            if (err) throw err;
            console.log('The new role entered has been added successfully to the database.');

            db.query(`SELECT * FROM role`, (err, result) => {
                if (err) {
                    res.status(500).json({ error: err.message })
                    promptUser();
                }
                console.table(result);
                promptUser();
            });
        })
});
};

//Add employee prompt
addEmployee = () => {
    inquirer.prompt([
        {
            name: "first_name",
            type: "input",
            message: "Please enter the first name of the employee you want to add to the database."
        },
        {
            name: "last_name",
            type: "input",
            message: "Please enter the last name of the employee you want to add to the database."
        },
        {
            name: "role_id",
            type: "number",
            message: "Please enter the role id associated with the employee you want to add to the database. Enter ONLY numbers."
        },
        {
            name: "manager_id",
            type: "number",
            message: "Please enter the manager's id associated with the employee you want to add to the database. Enter ONLY numbers."
        }

    ]).then(function (response) {
        db.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [response.first_name, response.last_name, response.role_id, response.manager_id], function (err, data) {
            if (err) throw err;
            console.log('The new employee entered has been added successfully to the database.');

            db.query(`SELECT * FROM employee`, (err, result) => {
                if (err) {
                    res.status(500).json({ error: err.message })
                    promptUser();
                }
                console.table(result);
                promptUser();
            });
        })
});
};

//Update employee prompt
updateEmployee = () => {

  //Grabs employees from the Employees Table
  const employeeSql = `SELECT * FROM employee`;

  connection.promise().query(employeeSql, (err, data) => {
    if (err) throw err; 

  const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));

    inquirer.prompt([
      {
        type: 'list',
        name: 'name',
        message: "Which employee would you like to update?",
        choices: employees
      }
    ])
      .then(empChoice => {
        const employee = empChoice.name;
        const params = []; 
        params.push(employee);

        const roleSql = `SELECT * FROM role`;

        connection.promise().query(roleSql, (err, data) => {
          if (err) throw err; 

          const roles = data.map(({ id, title }) => ({ name: title, value: id }));
          
            inquirer.prompt([
              {
                type: 'list',
                name: 'role',
                message: "What is the employee's new role?",
                choices: roles
              }
            ])
                .then(roleChoice => {
                const role = roleChoice.role;
                params.push(role); 
                
                let employee = params[0]
                params[0] = role
                params[1] = employee 

                //Updates the employee using SQL
                const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;

                connection.query(sql, params, (err, result) => {
                  if (err) throw err;
                console.log("Employee has been updated!");
              
                showEmployees();
          });
        });
      });
    });
  });
};

//Update manager prompt
updateManager = () => {
  // get employees from employee table 
  const employeeSql = `SELECT * FROM employee`;

  connection.promise().query(employeeSql, (err, data) => {
    if (err) throw err; 

  const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));

    inquirer.prompt([
      {
        type: 'list',
        name: 'name',
        message: "Which employee would you like to update?",
        choices: employees
      }
    ])
      .then(empChoice => {
        const employee = empChoice.name;
        const params = []; 
        params.push(employee);

        const managerSql = `SELECT * FROM employee`;

          connection.promise().query(managerSql, (err, data) => {
            if (err) throw err; 

          const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
            
              inquirer.prompt([
                {
                  type: 'list',
                  name: 'manager',
                  message: "Who is the employee's manager?",
                  choices: managers
                }
              ])
                  .then(managerChoice => {
                    const manager = managerChoice.manager;
                    params.push(manager); 
                    
                    let employee = params[0]
                    params[0] = manager
                    params[1] = employee 
                
                    //Updates employee's manager id using SQL
                    const sql = `UPDATE employee SET manager_id = ? WHERE id = ?`;

                    connection.query(sql, params, (err, result) => {
                      if (err) throw err;
                    console.log("Employee has been updated!");
                  
                    showEmployees();
          });
        });
      });
    });
  });
};

//View employee by department
employeeDepartment = () => {
  console.log('Showing employee by departments...\n');

  //Uses SQL to create a table using employee's name, role, and department data
  const sql = `SELECT employee.first_name, 
                      employee.last_name, 
                      department.name AS department
               FROM employee 
               LEFT JOIN role ON employee.role_id = role.id 
               LEFT JOIN department ON role.department_id = department.id`;

  connection.promise().query(sql, (err, rows) => {
    if (err) throw err; 
    console.table(rows); 
    promptUser();
  });          
};

//Delete department prompt
deleteDepartment = () => {
  
  //Grabs all departments from departments table
  const deptSql = `SELECT * FROM department`; 

  connection.promise().query(deptSql, (err, data) => {
    if (err) throw err; 

    const dept = data.map(({ name, id }) => ({ name: name, value: id }));

    inquirer.prompt([
      {
        type: 'list', 
        name: 'dept',
        message: "What department do you want to delete?",
        choices: dept
      }
    ])
      .then(deptChoice => {
        const dept = deptChoice.dept;

        //Uses SQL to pull the selected department and deletes the data
        const sql = `DELETE FROM department WHERE id = ?`;

        connection.query(sql, dept, (err, result) => {
          if (err) throw err;
          console.log("Successfully deleted!"); 

        showDepartments();
      });
    });
  });
};

//Delete role prompt
deleteRole = () => {

  //Grabs all roles from the roles table
  const roleSql = `SELECT * FROM role`; 

  connection.promise().query(roleSql, (err, data) => {
    if (err) throw err; 

    const role = data.map(({ title, id }) => ({ name: title, value: id }));

    inquirer.prompt([
      {
        type: 'list', 
        name: 'role',
        message: "What role do you want to delete?",
        choices: role
      }
    ])
      .then(roleChoice => {
        const role = roleChoice.role;

        //Uses SQL to pull the selected role and deletes the data
        const sql = `DELETE FROM role WHERE id = ?`;

        connection.query(sql, role, (err, result) => {
          if (err) throw err;
          console.log("Successfully deleted!"); 

          showRoles();
      });
    });
  });
};

//Delete employee prompt
deleteEmployee = () => {
  //Grabs all employees from the employee table
  const employeeSql = `SELECT * FROM employee`;

  connection.promise().query(employeeSql, (err, data) => {
    if (err) throw err; 

  const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));

    inquirer.prompt([
      {
        type: 'list',
        name: 'name',
        message: "Which employee would you like to delete?",
        choices: employees
      }
    ])
      .then(empChoice => {
        const employee = empChoice.name;

        //Uses SQL to pull the selected employee and delete their data
        const sql = `DELETE FROM employee WHERE id = ?`;

        connection.query(sql, employee, (err, result) => {
          if (err) throw err;
          console.log("Successfully Deleted!");
        
          showEmployees();
    });
  });
 });
};

//View budget prompt
viewBudget = () => {
    console.log('Showing budget by department...\n');
    
    //Uses SQL to create a table using the departments and combining all salary data to give department salaries
    const sql = `SELECT department_id AS id, 
                        department.name AS department,
                        SUM(salary) AS budget
                 FROM  role  
                 JOIN department ON role.department_id = department.id GROUP BY  department_id`;
    
    connection.promise().query(sql, (err, rows) => {
      if (err) throw err; 
      console.table(rows);
  
      promptUser(); 
    });            
  };