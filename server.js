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
        if (data.employee_tracker === "Add Employee") {
            addEmployee();
        }
        if (data.employee_tracker === "Update Employee Role") {
            updateEmployee();
        }
        if (data.employee_tracker === "Quit") {
            quit();
        }
    } catch (err) {
        console.error(err);
    }
};

init();

const fetchDepartments = async (departmentName) => {
    const getDepts = `SELECT id, name FROM department;`;
    const [departments] = await db.promise().query(getDepts);

    if (departmentName) {
        const department = departments.find(dept => dept.name === departmentName);
        return department ? department.value : null;
    }
    return departments;
};

const viewDepts = () => {
    db.query('SELECT department.id, department.name AS departments FROM department', function (err, results) {
        console.table(results);
        init();
    });
};

const viewRoles = () => {
    db.query('SELECT role.id AS role_id, role.title, role.salary, department.name AS department FROM role LEFT JOIN department ON role.department_id = department.id', function (err, results) {
        console.table(results);
        init();
    });
};

const viewEmployees = () => {
    db.query('SELECT employee.id as emp_id, employee.first_name, employee.last_name, CONCAT(manager.first_name, " ", manager.last_name) AS manager, role.title AS role, role.salary, department.name AS department FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee AS manager ON employee.manager_id = manager.id;', function (err, results) {
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
            console.log('New department added successfully');
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
                value: department.id
            })),
        }
    ]).then((answers) => {
        const title = answers.newRole;
        const salary = answers.newRoleSalary
        const departmentId = answers.newRoleDept;

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

const addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'Please enter the new employee\'s first name:',
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'Please enter the new employee\'s last name:',
        }
    ]).then((answers) => {
        const { firstName, lastName } = answers;
        db.query('SELECT * FROM role', function (err, res) {
            if (err) {
                console.error('Error fetching roles:', err);
                return;
            }
            const roleArr = res.map(({ id, title }) => ({
                name: `${title}`,
                value: id
            }));
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'roleId',
                    message: 'Which role would you like to assign?',
                    choices: roleArr
                }
            ]).then((roleResults) => {
                const { roleId } = roleResults;
                db.query('SELECT * FROM employee', function (err, employees) {
                    if (err) {
                        console.error('Error fetching employees:', err);
                        return;
                    }
                    const managerArr = employees.map(({ id, first_name, last_name }) => ({
                        name: `${first_name} ${last_name}`,
                        value: id
                    }));
                    managerArr.unshift({ name: 'None', value: null });
                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'managerId',
                            message: 'Please select a manager for the new employee:',
                            choices: managerArr
                        }
                    ]).then((managerResult) => {
                        const { managerId } = managerResult;
                        db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [firstName, lastName, roleId, managerId], (err, res) => {
                            if (err) {
                                console.error('Error adding new employee:', err);
                                return;
                            }
                            console.log('New employee added successfully');
                            init();
                        });
                    });
                });
            });
        });
    });
};

const updateEmployee = () => {
    db.query('SELECT * FROM employee', function (err, results) {
        const employeeArr = results.map(({ first_name, last_name, id }) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }));
        inquirer.prompt([
            {
                type: 'list',
                name: 'employees',
                message: 'Which employee would you like to update?',
                choices: employeeArr
            }
        ]).then((results) => {
            db.query('SELECT * FROM role', function (err, res) {
                const roleArr = res.map(({ id, title }) => ({
                    name: `${title}`,
                    value: id
                }));
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'roles',
                        message: 'Which role would you like to assign?',
                        choices: roleArr
                    }
                ]).then((roleResults) => {
                    const roleId = roleResults.roles;
                    const employeeId = results.employees;
                    db.query('UPDATE employee SET role_id = ? WHERE id = ?', [roleId, employeeId])
                    console.log('Employee role updated successfullly');
                    init();
                });
            });
        });
    });
};

const quit = () => {
    process.exit();
}