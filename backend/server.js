

require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

connection.connect((err) => {
    if (err) {
        console.error("MySQL error: " + err.message);
        return;
    }
    console.log('MySQL connected');
});

app.get('/', (request, response) => {
    response.status(200).json({ message: "connection success" });
});

// GET all stagaires
app.get('/stagaires', (request, response) => {
    const query = 'SELECT * FROM stagaires';
    connection.query(query, (err, result) => {
        if (err) {
            return response.status(500).json({ message: "Error fetching data: " + err.message });
        }
        response.status(200).json(result);
        // console.log(result);
    });
});

// INSERT new stagiaire
app.post('/stagaires', (request, response) => {
    const { nom, age, ville } = request.body;
    const query = 'INSERT INTO stagaires (nom, age, ville) VALUES (?, ?, ?)';
    
    connection.query(query, [nom, age, ville], (err, result) => {
        if (err) {
            return response.status(500).json({ message: "Error inserting data: " + err.message });
        }
        response.status(201).json({ id: result.insertId, nom, age, ville });
        // console.log(result);
    });
});

app.listen(5001, () => {
    console.log('Server running on port 5001');
});
