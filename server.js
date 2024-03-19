// Import required packages
const mysql = require('mysql2');
const inquirer = require('inquirer');

// Set PORT for server to use
const PORT = process.env.PORT || 3001;

// Connect to the Database
const db = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employees_db',
}, function(err) {
    if (err) throw err;
    console.log('Connected to employees_db');
});

// Query the user
const inquiries = [
    {
        type: 'list',
        name: 'employee_tracker',
        message: 'What would you like to do?',
        choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role', 'Quit']
    }
]

// Initialize inquiries
async function init() {
    try {
        const data = await inquirer.prompt(inquiries);
        if (data.employee_tracker === "View All Departments") {
            viewDepts();
        }
        if (data.employee_tracker === "View All Roles") {
            viewRoles();
        }
        if (data.employee_tracker === "View All Employees") {
            viewEmployees();
        }
        if (data.employee_tracker === "Add Department") {
            addDept();
        }
        if (data.employee_tracker === "Add Role") {
            addRole();
        }
        if (data.employee_tracker === "Update Employee Role") {
            updateEmployee();
        }
    } catch (err) {
        console.error(err);
    }
};

init();

const fetchDepartments = async () => {
    const getDepts = `SELECT id AS value, name FROM department;`;
    const [departments] = await db.promise().query(getDepts);
    return departments;
};

const viewDepts = () => {
    db.query('SELECT department.id, department.name AS departments FROM department', function (err, results) {
        console.table(results);
        init();
    });
};

const viewRoles = () => {
    db.query('SELECT role.id AS role_id, role.title, role.salary, role.department_id FROM role', function (err, results) {
        console.table(results);
        init();
    });
};

const viewEmployees = () => {
    db.query('SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id, role.title AS role_title, role.salary, department.name AS department_name FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id;', function (err, results) {
        console.table(results);
        init();
    });
};

const addDept = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'newDept',
            message: 'Enter new department name:',
        }
    ]).then((answers) => {
        db.query('INSERT INTO department (name) VALUES (?)', [answers.newDept], (err, results) => {
            if (err) {
                console.error('Error adding department:', error);
            } else {
            console.table(results);
            init();
            }
        });
    })
    .catch((err) => {
        console.error('Error:', error);
    });
};

const addRole = async () => {
    const choices = await fetchDepartments();
    inquirer.prompt ([
        {
            type: 'input',
            name: 'newRole',
            message: 'Please enter a name for the new role:',
        },
        {
            type: 'input',
            name: 'newRoleSalary',
            message: 'Please enter a salary for the new role:',
        },
        {
            type: 'list',
            name: 'newRoleDept',
            message: 'Please assign the new role to one of the following departments:',
            choices: choices.map(department => ({
                name: department.name,
                value: department.value
            })),
        }
    ]).then((answers) => {
        const title = answers.newRole;
        const salary = answers.newRoleSalary
        const departmentId = answers.department;

        db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [title, salary, departmentId], (err, results) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log('New role added successfully');
            init();
        });
    });
};

const updateEmployee = () => {
    db.query('SELECT * FROM employee', function (err, results) {
        console.log(results);
        const employeeArr = results.map(({ first_name, last_name, id }) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }));
        console.log(employeeArr)
        inquirer.prompt([
            {
                type: 'list',
                name: 'employees',
                message: 'Which employee would you like to update?',
                choices: employeeArr
            }
        ]).then((results) => {
            console.log('results', results);
            db.query('SELECT * FROM role', function (err, res) {
                console.log(res);
                const roleArr = res.map(({ id, title }) => ({
                    name: `${title}`,
                    value: id
                }));
                console.log(roleArr)
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'roles',
                        message: 'Which role would you like to assign?',
                        choices: roleArr
                    }
                ]).then((rollsResults) => {
                    const rollId = rollsResults.roles;
                    const employeeId = results.employees;
                    console.log(rollId, employeeId)
                    db.query('UPDATE employee SET role_id = ? WHERE id = ?', [rollId, employeeId])
                    console.log('Employee role updated successfullly');
                    init();
                })
            })
        })
    })
}