//Class for running DB queries
import { pool } from './connection.js';
export default class Db {
    constructor() { }
    //collect client data 
    async query(sql, args = []) {
        const client = await pool.connect();
        try {
            const result = await client.query(sql, args);
            return result;
        }
        catch (error) {
            console.error(error);
        }
        finally {
            client.release();
        }
    }
    //method to find employees
    findAllEmployees() {
        const sql = "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, '' , manager.last_name) AS manager FROM employee left JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;";
        return this.query(sql); //get manager, role, department tables
    }
    //method to add employee
    addNewEmployee(employee) {
        const { first_name, last_name, role_id, manager_id } = employee;
        return this.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [first_name, last_name, role_id, manager_id]);
    }
    //method to delete employee
    deleteEmployee(employeeId) {
        return this.query('DELETE from employee WHERE id=$1', [employeeId]);
    }
    //method to find roles
    findAllRoles() {
        return this.query('SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;');
    }
    //method to add role
    addNewRole(role) {
        const { title, salary, department_id } = role;
        return this.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department_id]);
    }
    //method to delete role
    deleteRole(roleId) {
        return this.query('DELETE FROM role WHERE id = $1;', [roleId]);
    }
    //method to find departments
    findAllDepartments() {
        return this.query('SELECT id, name FROM department;');
    }
    //method to add department
    addNewDepartment(department) {
        const { name } = department;
        return this.query('INSERT INTO department (name) VALUES ($1)', [name]);
    }
    //method to delete department
    deleteDepartment(departmentId) {
        return this.query('DELETE FROM department WHERE id = $1;', [departmentId]);
    }
}
