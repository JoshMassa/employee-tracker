// Import required packages
const express = require('express');
const mysql = require('mysql2');

// Set PORT for server to use
const PORT = process.env.PORT || 3001;

// Initialize App
const app = express();

// Import Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect to the Database
const db = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employees_db',
}, console.log('Connected to employees_db'));

// Set Homepage End Point
app.get('/', (req, res) => {
    res.send('Welcome to our homepage!')
});

// Listen For Requests To Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});