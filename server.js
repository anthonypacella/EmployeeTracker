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
                        VALUES ('${data.role_title}',${data.role_salary}, (SELECT id FROM departments WHERE department_name = '${data.department_name}'))`, function (err, results) {
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
                            console.log("Department Added");
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
        SELECT employees.id ID, employees.first_name First_Name, employees.last_name Last_Name, roles.role_title Title, departments.department_name Department, roles.role_salary Salary FROM employees
        JOIN roles ON employees.role_id = roles.id 
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

function addInfo(table, valuesArray) {
  if (table == "departments") {
    db.query(
      `INSERT INTO ${table} (department_name) VALUES (${valuesArray[0]});`
    );
  } else if (table == "roles") {
    db.query(
      `INSERT INTO ${table} (role_title, role_salary, department_id) VALUES (${valuesArray[0]},${valuesArray[1]}, ${valuesArray[2]});`
    );
  } else if (table == "employees") {
    db.query(
      `INSERT INTO ${table} (first_name, last_name, role_id, manager_id) VALUES (${valuesArray[0]},${valuesArray[1]}, ${valuesArray[2]}, ${valuesArray[3]});`
    );
  }
}

function updateInfo() {}

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
init();
