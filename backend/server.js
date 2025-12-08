const express = require('express');
const app = express();
const cors = require("cors");

const pool = require('./db');
app.use(cors())
app.use(express.json());

const {getAllStagiaires,  deleteStagiaire , createStagiaire , getStagiaireById , updateStagiaire} = require('./controllers/stagiaireController');
app.get('/', (req, res) => {
    res.send('API is working');
});


// Test DB connection
// app.get('/stagaires', async (req, res) => {
//     try {
//         const [rows] = await pool.query('SELECT * FROM stagaires');
//         res.json({ data: rows });
//     } catch (err) {
//         res.status(500).json({ error: 'Database connection failed ❌' });
//     }
// });

app.get('/stagiaires', getAllStagiaires);
app.get('/stagiaires/:id', getStagiaireById);
app.delete('/stagiaires/:id', deleteStagiaire);
app.post('/stagiaires', createStagiaire);
app.put('/stagiaires/:id', updateStagiaire);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
