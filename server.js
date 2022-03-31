const inquirer = require('inquirer');
const fs = require('fs');
const mysql = require('mysql2');
const express = require('express');
const consoleTable = require('console.table');

const PORT = process.env.PORT || 3001;
const app = express();

const db = mysql.createConnection(
    {
      host: '127.0.0.1',
      user: 'root',
      password: '',
      database: 'employee_db'
    },
    console.log('Connected to employee database')
  );

const viewAllEmployees = 'View All Employees';
const updateEmployeeRole = 'Update Employee Role';
const viewAllRoles = 'View All Roles';
const addRole = 'Add Role';
const viewAllDepartments = 'View All Departments';
const addDepartment = 'Add Department';
const quit = 'Quit';

function init() {

inquirer
  .prompt([
    {
      type: 'list',
      message: 'What would you like to do?',
      name: 'navigation',
      choices: [viewAllEmployees, updateEmployeeRole, viewAllRoles, addRole, viewAllDepartments, addDepartment, quit]
    },
  ])
  .then((data) => {
    if(data.navigation == viewAllEmployees)
        {
            viewInfo("employees");
        }  
    else if(data.navigation == updateEmployeeRole)
        {
            updateInfo();
        }  
    else if(data.navigation == viewAllRoles)
        {
            viewInfo("role_title", "roles");
        } 
    else if(data.navigation == addRole)
        {
            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'role_title',
                        message: 'What is the title of the role you would like to add?'
                    },
                    {
                        type: 'input',
                        name: 'role_salary',
                        message: 'What is the salary of the role you would like to add?'
                    },
                    {
                        type: 'input',
                        name: 'deptartment_id',
                        message: 'What is the department ID of the role you would like to add?'
                    },
                ])
                .then((data) => {
                    valuesArray[0] = data.role_title;
                    valuesArray[1] = data.role_salary;
                    valuesArray[2] = data.department_id;
                })
            addInfo("roles", valuesArray);
        } 
    else if(data.navigation == viewAllDepartments)
        {
            viewInfo("department_name", "departments");
        } 
    else if(data.navigation == addDepartment)
        {
            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'department_name',
                        message: 'What is the name of the department you would like to add?'
                    },
                ])
                .then((data) => {
                    valuesArray[0] = data.department_name;
                })
            addInfo("departments", valuesArray);  
            init();      
        } 
    else if(data.navigation == quit)
        {
            process.exit();
        } 
    });
}

function viewInfo(table) {
    db.query(`SELECT * FROM ${table}`, function (err, results) {
        console.log("HELLO");
    })
    init();
    }

function addInfo(table, valuesArray) {
    if (table == "departments") {
        db.query(`INSERT INTO ${table} (department_name) VALUES (${valuesArray[0]});`);
    }
    else if (table == "roles") {
        db.query(`INSERT INTO ${table} (role_title, role_salary, department_id) VALUES (${valuesArray[0]},${valuesArray[1]}, ${valuesArray[2]});`);
    }
    else if (table == "employees") {
        db.query(`INSERT INTO ${table} (first_name, last_name, role_id, manager_id) VALUES (${valuesArray[0]},${valuesArray[1]}, ${valuesArray[2]}, ${valuesArray[3]});`);
    }
    init();
}

function updateInfo() {

}


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  init();