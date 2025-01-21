//This is where the app starts running

import inquirer from 'inquirer';
import Db from './db/index.js';

const db = new Db();

initialPrompts();

function initialPrompts() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'choice',
        message: 'What would you like to do?',
        choices: [
          {
            name: 'View All Employees',
            value: 'VIEW_EMPLOYEES',
          },
          {
            name: 'Add Employee',
            value: 'ADD_EMPLOYEE',
          },
          {
            name: 'Remove Employee',
            value: 'REMOVE_EMPLOYEE',
          },
          {
            name: 'View All Roles',
            value: 'VIEW_ROLES',
          },
          {
            name: 'Add Role',
            value: 'ADD_ROLE',
          },
          {
            name: 'Remove Role',
            value: 'REMOVE_ROLE',
          },
          {
            name: 'View All Departments',
            value: 'VIEW_DEPARTMENTS',
          },
          {
            name: 'Add Department',
            value: 'ADD_DEPARTMENT',
          },
          {
            name: 'Remove Department',
            value: 'REMOVE_DEPARTMENT',
          },
          {
            name: 'Quit',
            value: 'QUIT',
          },
        ],
      },
    ])
    .then((res) => {
      const choice = res.choice;
      switch (choice) {
        case 'VIEW_EMPLOYEES':
          viewEmployees();
          break;
        case 'ADD_EMPLOYEE':
          addEmployee();
          break;
        case 'REMOVE_EMPLOYEE':
          removeEmployee();
          break;
              case 'VIEW_ROLES':
              viewRoles();
              break;
              case 'ADD-ROLE':
                addRole();
                break;
                case 'REMOVE_ROLE':
              removeRole();
              break;
              case 'VIEW_DEPARTMENTS':
                viewDepartments();
                break;
                case 'ADD_DEPARTMENT':
              addDepartment();
              break;
              case 'REMOVE_DEPARTMENT':
              removeDepartment();
              break;
        default:
          quit();
      }
    });
}
function viewEmployees() {
  db.findAllEmployees()
    .then((res) => {
      const employees = res?.rows;
      console.table(employees);
    })
    .then(() => initialPrompts());
}

function addEmployee() {
  inquirer
    .prompt([
      {
        name: 'first_name',
        message: '"What is the emploee\'s first name?',
      },
      {
        name: 'last_name',
        message: '"What is the emploee\'s last name?',
      },
    ])
    .then((res) => {
      const firstName = res.first_name;
      const lastName = res.last_name;

      db.findAllRoles().then((response) => {
        const roles = response?.rows;
        const roleChoices = roles?.map((role) => {
          const id = role.id;
          const title = role.title;

          return {
            name: title,
            value: id,
          }
        });
        inquirer
          .prompt([
            {
              type: 'list',
              name: 'roleId',
              message: 'What is the emploee\'s role?',
              choices: roleChoices,
            }
          ])
          .then((res) => {
            const roleId = res.roleId;

            db.findAllEmployees().then((res) => {
              const employees = res?.rows;
              const managerChoices = employees?.map((employee) => {
                const id = employees.id;
                const firstName = employee.first_name;
                const lastName = employee.last_name;
                return {
                  name: `${firstName} ${lastName}`,
                  value: id,
                };
              });
              managerChoices?.unshift({ name: 'None', value: null });

              inquirer
                .prompt([
                  {
                    type: 'list',
                    name: 'managerId',
                    message: 'who is the employee\'s manager?',
                    choices: managerChoices,
                  }
                ])
                .then((res) => {
                  const employee = {
                    first_name: firstName,
                    last_name: lastName,
                    manager_id: res.managerId,
                    role_Id: roleId,
                  };
                  db.addNewEmployee(employee);
                })
                .then(() => {
                  console.log(`Added ${firstName} ${lastName} to the database`);
                })
                .then(() => {
                  initialPrompts();
                });
            })
          })
      })
    })
}

function removeEmployee() {
  //find all employess
  //create view to sleect employees
  //create prompt to choose which employee
  //run  the removeEmployee method
}

function viewRoles() {
  
}