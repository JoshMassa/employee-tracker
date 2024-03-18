// Import required packages
const inquirer = require('inquirer');

// Query the user
const inquiries = [
    {
        type: 'list',
        name: 'employee tracker',
        message: 'What would you like to do?',
        choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role', 'Quit']
    }
]

// Initialize inquiries
async function init() {
    try {
        const data = await inquirer.prompt(inquiries);
    } catch (err) {
        console.error(err);
    }
};

init();