INSERT INTO department (name)
VALUES
('IT'),
('Research & Development'),
('Finance'),
('Marketing & Sales'),
('Legal'),
('HR'),
('Executive');


INSERT INTO role (title, salary, department_id)
VALUES
('Full Stack Developer', 80000, 1),
('Software Engineer', 120000, 1),
('Research Associate', 80000, 2),
('Accountant', 150000, 3),
('Fincancial Analyst', 150000, 3),
('Marketing Coordinator', 80000, 4),
('Sales Lead', 85000, 4),
('Attorney', 200000, 5),
('Recruiter', 40000, 6),
('CEO', 300000, 7);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Monica', 'Leem', 1, 1),
('Brady', 'Wagner', 2, null),
('Thomas', 'Fagan', 3, 2),
('Jamison', 'Kane', 4, null),
('Nathan', 'Bochen', 8, 4),
('Tyler', 'Stricland', 9, 2),
('Jay', 'Nusbam', 6, null);