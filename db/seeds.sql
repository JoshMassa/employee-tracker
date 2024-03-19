INSERT INTO department (name)
VALUES ('Development'),
       ('Human Resources'),
       ('Quality Management');

INSERT INTO role (title, salary, department_id)
VALUES ('Software Engineer', 120000, 1),
       ('Chief Technology Officer', 300000, 1),
       ('Talent Acquisition', 54000, 2),
       ('HR Manager', 75000, 2),
       ('Quality Technician', 45000, 3),
       ('Quality Control Supervisor', 80000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ('John', 'Pecan', 1, 2),
        ('Steve', 'Crumble', 2, NULL),
        ('Jack', 'Rhubarb', 3, 4),
        ('Alyssa', 'Dandelion', 4, NULL),
        ('Samantha', 'Clementine', 5, 6),
        ('Delilah', 'Wobblewhiskers', 6, NULL);