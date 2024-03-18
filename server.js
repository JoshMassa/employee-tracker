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
}, console.log('Connected to employees_db'));

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
        if (data.employee_tracker === "Update Employee Role") {
            updateEmployee();
        }
    } catch (err) {
        console.error(err);
    }
};

init();

const viewDepts = () => {
    db.query('SELECT department.id, department.name AS departments FROM department', function (err, results) {
        console.log(results);
        init();
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