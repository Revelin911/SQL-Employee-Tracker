//This is where the app starts running

import inquirer from 'inquirer';
import Db from './db/index.js';

const db = new Db();

function initialPrompts() {
  inquirer
  .prompt([
    {
      type: choices
      choices: [
      {
        name: '',
        value: '',
      },

    ]) 
    .then ((res) => {
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
              view employee
              add role
              remove role
              view department
              add department
              remove department
              case 'QUIT':
                quit();
                default:
                  quit();
                break;
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
.prompt ([
  {
name: 'first_name',
message: '"What is the emploee\'s first_name',
  },
  {
    name: 'last_name',
    message: '"What is the emploee\'s last_name',
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
        managerChoices?.unshift({name: 'None', value: null});

        inquirer
        .prompt ([
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
            roleIdL roleId,
          };
          db.addEmployee(employee);
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