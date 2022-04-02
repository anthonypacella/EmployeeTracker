const inquirer = require("inquirer");
const fs = require("fs");
const mysql = require("mysql2");
const express = require("express");
const consoleTable = require("console.table");
const { resolve } = require("path");

const PORT = process.env.PORT || 3001;
const app = express();

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "",
    database: "employee_db",
  },
  console.log("Connected to employee database")
);

const viewAllEmployees = "View All Employees";
const addEmployee = "Add Employee";
const updateEmployeeRole = "Update Employee Role";
const viewAllRoles = "View All Roles";
const addRole = "Add Role";
const viewAllDepartments = "View All Departments";
const addDepartment = "Add Department";
const quit = "Quit";

function init() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "navigation",
        choices: [
          viewAllEmployees,
          addEmployee,
          updateEmployeeRole,
          viewAllRoles,
          addRole,
          viewAllDepartments,
          addDepartment,
          quit,
        ],
      },
    ])
    .then((data) => {
      const valuesArray = [];

      if (data.navigation == viewAllEmployees) {
        viewInfo("employees");
      } else if (data.navigation == addEmployee) {
        inquirer
        .prompt([
          {
            type: "input",
            name: "first_name",
            message: "What is the employee's first name?",
          },
          {
            type: "input",
            name: "last_name",
            message: "What is the employee's last name?",
          },
          {
            type: "list",
            name: "role_title",
            message:
              "What is the employee's role?",
            choices: showRoles()
          },
          {
            type: "list",
            name: "manager",
            message:
              "Who is the employee's manager?",
            choices: showManagers()
          }
        ])
        .then((data) => {
            
            let qString = ` INSERT INTO employees (first_name, last_name, role_id, manager_id) 
                            VALUES ('${data.first_name}', '${data.last_name}', (SELECT id from (SELECT * FROM roles) roles2  WHERE role_title = '${data.role_title}'), (SELECT id from (SELECT * FROM employees) employees2 WHERE first_name = '${data.first_name}' and last_name='${data.last_name}'));`

            db.query(qString, function (err, results) {
                console.log("Employee added");
                init();
              });

          });

        addEmployeeFunction();
      } else if (data.navigation == updateEmployeeRole) {
        updateInfo();
      } else if (data.navigation == viewAllRoles) {
        viewInfo("roles");
      } else if (data.navigation == addRole) {
        inquirer
          .prompt([
            {
              type: "input",
              name: "role_title",
              message: "What is the title of the role you would like to add?",
            },
            {
              type: "input",
              name: "role_salary",
              message: "What is the salary of the role you would like to add?",
            },
            {
              type: "list",
              name: "department_name",
              message:
                "What is the department of the role you would like to add?",
              choices: showDepartments()
            },
          ])
          .then((data) => {
            db.query(`  INSERT INTO roles (role_title, role_salary, department_id)
                        VALUES ('${data.role_title}',${data.role_salary}, (SELECT id FROM departments WHERE department_name = '${data.department_name}'));`, function (err, results) {
                            console.log("Role Added");
                            init();
                        });
            });
      } else if (data.navigation == viewAllDepartments) {
        viewInfo("departments");
      } else if (data.navigation == addDepartment) {
        inquirer
          .prompt([
            {
              type: "input",
              name: "department_name",
              message:
                "What is the name of the department you would like to add?",
            },
          ])
          .then((data) => {
            db.query(`  INSERT INTO departments (department_name)
                        VALUES ('${data.department_name}')`, function (err, results) {
                            console.log(`Department ${data.department_name} Added to the database`);
                            init();
                        });          
                    });
      } else if (data.navigation == quit) {
        process.exit();
      }
    });
}

function viewInfo(info) {

    let qString = ``;

    if (info == "employees") {
        qString = `   
        SELECT employees.id ID, employees.first_name First_Name, employees.last_name Last_Name, roles.role_title Title, departments.department_name Department, roles.role_salary Salary, concat(emp2.first_name, ' ', emp2.last_name) Manager
        FROM employees
        JOIN roles ON employees.role_id = roles.id 
        JOIN employees emp2 ON employees.manager_id = emp2.id
        JOIN departments ON roles.department_id = departments.id
        `;
    }
    else if (info == "roles") {
        qString = `   
        SELECT roles.id ID, roles.role_title Title, departments.department_name Department, roles.role_salary FROM roles
        JOIN departments ON roles.department_id = departments.id`;
    }
    else if (info == "departments") {
        qString = `   
        SELECT * FROM departments
        `;
    }

  db.query(qString, function (err, results) {
    console.table(results);
    init();
  });
}

function addEmployeeFunction() {

}

function updateInfo() {


}

function showDepartments () {
    qString = `   
        SELECT department_name FROM departments
        `;
    let deptArray = [];

  db.query(qString, function (err, results) {
    for (let i = 0; i < results.length; i++) {
        deptArray[i] = results[i].department_name;
        }
    });

    return deptArray;
}

function showRoles () {
    qString = `   
        SELECT role_title FROM roles
        `;
    let rolesArray = [];

  db.query(qString, function (err, results) {
    for (let i = 0; i < results.length; i++) {
        rolesArray[i] = results[i].role_title;
        }
    });

    return rolesArray;
}

function showManagers () {
    qString = `   
        SELECT concat(employees.first_name, ' ', employees.last_name) Full_Name FROM employees
        `;
    let employeesArray = [];

  db.query(qString, function (err, results) {
    for (let i = 0; i < results.length; i++) {
         employeesArray[i] = results[i].Full_Name;
         }
    });

    return employeesArray;
}
init();
