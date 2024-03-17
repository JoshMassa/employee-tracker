INSERT INTO department (id, name)
VALUES (1, 'Development'),
       (2, 'Human Resources'),
       (3, 'Quality Management');

INSERT INTO role (id, title, salary, department_id)
VALUES (1, 'Software Engineer', 120000, 1),
       (2, 'Chief Technology Officer', 300000, 1),
       (3, 'Talent Acquisition', 54000, 2),
       (4, 'HR Manager', 75000, 2),
       (5, 'Quality Technician', 45000, 3),
       (6, 'Quality Control Supervisor', 80000, 3);

INSERT INTO employee (first_name, last_name, role_id)
VALUES  ('John', 'Pecan', 1),
        ('Steve', 'Crumble', 2),
        ('Jack', 'Rhubarb', 3),
        ('Alyssa', 'Dandelion', 4),
        ('Samantha', 'Clementine', 5),
        ('Delilah', 'Wobblewhiskers', 6);

UPDATE employee
SET manager_id =
    CASE
        WHEN first_name = 'John' AND last_name = 'Pecan' THEN 2
        WHEN first_name = 'Jack' AND last_name = 'Rhubarb' THEN 4
        WHEN first_name = 'Samantha' AND last_name = 'Clementine' THEN 6
    END
WHERE first_name IN ('John', 'Jack', 'Samantha') AND last_name IN ('Pecan', 'Rhubarb', 'Clementine');