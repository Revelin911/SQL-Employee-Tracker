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
function quit() {
    process.exit(0);
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
            type: 'input',
            name: 'first_name',
            message: 'What is the employee\'s first name?',
        },
        {
            type: 'input',
            name: 'last_name',
            message: '"What is the employee\'s last name?',
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
                };
            });
            inquirer
                .prompt([
                {
                    type: 'list',
                    name: 'roleId',
                    message: 'What is the employee\'s role?',
                    choices: roleChoices,
                }
            ])
                .then((res) => {
                const roleId = res.roleId;
                db.findAllEmployees().then((res) => {
                    const employees = res?.rows;
                    const managerChoices = employees?.map((employee) => {
                        const id = employee.id;
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
                            message: 'Who is the employee\'s manager?',
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
                });
            });
        });
    });
}
function removeEmployee() {
    db.findAllEmployees().then((res) => {
        const filteredEmployeeData = res?.rows.map((e) => {
            return {
                name: e.first_name + e.last_name,
                value: e.id,
            };
        });
        console.log(filteredEmployeeData);
        inquirer
            .prompt([
            {
                type: 'list',
                name: 'removeEmployee',
                message: 'Which employee would you like to remove?',
                choices: filteredEmployeeData,
            }
        ])
            .then((answers) => {
            db.deleteEmployee(answers.removeEmployee).then(() => {
                console.log('employee deleted');
                initialPrompts();
            });
        });
    });
}
;
// find all employess
// create view to sleect employees
// create prompt to choose which employee
// run  the removeEmployee method
// }
function viewRoles() {
    db.findAllRoles()
        .then((res) => {
        const roles = res?.rows;
        console.table(roles);
    })
        .then(() => initialPrompts());
}
function addRole() {
    db.findAllDepartments().then((response) => {
        const departments = response?.rows;
        const departmentChoices = departments?.map((department) => {
            return {
                name: department.name,
                value: department.id,
            };
        });
        inquirer
            .prompt([
            {
                type: 'input',
                name: 'title',
                message: 'What is the name of the role?',
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the salary of the role?',
            },
            {
                type: 'list',
                name: 'department_id',
                message: 'Which department does the role belong to?',
                choices: departmentChoices,
            },
        ]);
    })
        .then((res) => {
        const roles = {
            title: res.title,
            salary: res.salary,
            department_id: res.departmentId,
        };
        db.addNewRole(roles);
    })
        .then(() => {
        // console.log(`Added ${roles} to the database`);
    })
        .then(() => {
        initialPrompts();
    });
}
function removeRole() {
    // db.deleteRole()
    //   .then((_response: any) => {
    //     const roles = response?.rows;
    //     // const roleChoices = roles?.map((role) => {
    //     //   const id = role.id;
    //     //   const title = role.title;
    //     //   return {
    //     //     name: title,
    //     //     value: id,
    //     //   }
    //     })
}
;
// inquirer
// .prompt([
//   {
//     type:'list',
//     name: 'roleId',
//     message: 'Which role would you like to remove?',
//     // choices: roleChoices
//   }
// ]);
// }
function viewDepartments() {
    db.findAllDepartments()
        .then((res) => {
        const departments = res?.rows;
        console.table(departments);
    })
        .then(() => initialPrompts());
}
function addDepartment() {
    inquirer
        .prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of the department?',
        },
    ])
        .then((res) => {
        const departments = res.name;
        db.addNewDepartment(departments);
    })
        .then(() => {
        // console.log(`Added ${department} to the database`);
    })
        .then(() => {
        initialPrompts();
    });
}
;
function removeDepartment() {
}
