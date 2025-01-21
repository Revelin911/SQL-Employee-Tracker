-- Seed data for the employees database

-- Insert departments
INSERT INTO department 
(name) 
VALUES
('Engineering'),
('Human Resources'),
('Finance'),
('Marketing');

-- Insert roles
INSERT INTO role 
(title, salary, department_id) 
VALUES
('Software Engineer', 90000, 1),
('HR Specialist', 60000, 2),
('Accountant', 70000, 3),
('Marketing Coordinator', 55000, 4);

-- Insert employees
INSERT INTO employee 
(first_name, last_name, role_id, manager_id) 
VALUES
('John', 'Doe', 1, NULL),
('Jane', 'Smith', 2, 1),
('Alice', 'Johnson', 3, 1),
('Bob', 'Brown', 4, NULL);
       
