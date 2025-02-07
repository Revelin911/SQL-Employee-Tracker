//This is where the app starts running
//importing routes
import inquirer from 'inquirer';
import Db from './db/index.js';
//creating database info
const db = new Db();
//method to call prompts
initialPrompts();
//prompts to ask user
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
            case 'ADD_ROLE':
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
//function to exit once user is done
function quit() {
    process.exit(0);
}
//view all employees in database
function viewEmployees() {
    //find employees
    db.findAllEmployees()
        .then((res) => {
        const employees = res?.rows;
        //show the employees available
        console.table(employees);
    })
        //return to prompts for user to answer again
        .then(() => initialPrompts());
}
//add employee to database
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
        //find all roles and assign employee to role
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
                //find all employees and assign manager accordingly
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
                            role_id: roleId,
                        };
                        //based on responses, add the new employee to database
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
//function to remove employees 
function removeEmployee() {
    //find employee by name, last name and id
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
            //await response and remove employee from database 
            .then((res) => {
            db.deleteEmployee(res.removeEmployee).then(() => {
                console.log('Employee deleted');
                initialPrompts();
            });
        });
    });
}
;
//view roles
function viewRoles() {
    //find roles and show in table
    db.findAllRoles()
        .then((res) => {
        const roles = res?.rows;
        console.table(roles);
    })
        .then(() => initialPrompts());
}
//add roles
function addRole() {
    //find departments and pull by name and i
    db.findAllDepartments().then((response) => {
        const departments = response?.rows;
        const departmentChoices = departments?.map((department) => {
            return {
                name: department.name,
                value: department.id,
            };
        });
        return inquirer
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
                name: 'departmentId',
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
        //adding new role to database
        db.addNewRole(roles);
    })
        .then((roles) => {
        console.log(`Added ${roles} to the database`);
    })
        .then(() => {
        initialPrompts();
    });
}
//remove roles
function removeRole() {
    //find all employees using first, last name and id
    db.findAllEmployees().then((res) => {
        const filteredRoleData = res?.rows.map((r) => {
            return {
                name: r.first_name + r.last_name,
                value: r.id,
            };
        });
        console.log(filteredRoleData);
        inquirer
            .prompt([
            {
                type: 'list',
                name: 'removeRole',
                message: 'Which role would you like to remove?',
                choices: filteredRoleData,
            }
        ])
            .then((res) => {
            db.deleteRole(res.removeRole).then(() => {
                console.log('Role deleted');
                initialPrompts();
            });
        });
    });
}
//view departments
function viewDepartments() {
    db.findAllDepartments()
        .then((res) => {
        const departments = res?.rows;
        console.table(departments);
    })
        .then(() => initialPrompts());
}
//add departments
function addDepartment() {
    inquirer
        .prompt([
        {
            type: 'input',
            name: 'departmentName',
            message: 'What is the name of the department?',
        },
    ])
        .then((res) => {
        const department = res.departmentName;
        //adding department to database
        return db.addNewDepartment(department);
    })
        .then((department) => {
        console.log(department);
        console.log(`Added ${department.department} to the database`);
    })
        .then(() => {
        initialPrompts();
    });
}
;
//remove department
function removeDepartment() {
    db.findAllEmployees().then((res) => {
        const filteredDepartmentData = res?.rows.map((d) => {
            return {
                name: d.first_name + d.last_name,
                value: d.id,
            };
        });
        console.log(filteredDepartmentData);
        inquirer
            .prompt([
            {
                type: 'list',
                name: 'removeDepartment',
                message: 'Which department would you like to remove?',
                choices: filteredDepartmentData,
            }
        ])
            .then((res) => {
            db.deleteDepartment(res.removeDepartment).then(() => {
                console.log('Department deleted');
                initialPrompts();
            });
        });
    });
}
