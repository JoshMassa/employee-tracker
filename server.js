// Import required packages
const express = require('express');
const mysql = require('mysql2');

// Import data from the employees.json file
const { department, role, employee } = require('./db/employees.json');

// Set PORT for server to use
const PORT = process.env.PORT || 3001;

// Initialize app
const app = express();

// Import middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect to the Database
const db = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employees_db',
}, console.log('Connected to employees_db'));

// Set homepage end point
app.get('/', (req, res) => {
    res.send('Welcome to our homepage!')
});

// Set end point to retrieve all departments 
app.get('/api/departments', (req, res) => {
    db.query('SELECT * FROM department', function (err, results) {
        console.log(results);
        res.status(200).json(results);
    });
});

// Set end point to retrieve all roles
app.get('/api/roles', (req, res) => {
    db.query('SELECT * FROM role', function (err, results) {
        console.log(results);
        res.status(200).json(results);
    });
});

// Set end point to retrieve all employees
app.get('/api/employees', (req, res) => {
    db.query('SELECT * FROM employee', function (err, results) {
        console.log(results);
        res.status(200).json(results);
    });
});

// Listen For Requests To Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});