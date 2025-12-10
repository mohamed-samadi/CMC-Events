require('dotenv').config();
const cors = require("cors");
const express = require('express');
const app = express();

const pool = require('./db');
app.use(cors())
app.use(express.json());



const stagiaireRoutes = require('./routes/stagiaireRoutes');
const formateurRoutes = require('./routes/formateurRoutes');
const polesRoutes = require('./routes/poleRoutes');
const filiereRoutes = require('./routes/filiereRoutes');
app.get('/', (req, res) => {
    res.send('API is working');
});




//manage api stagiaire routes
app.use('/api/stagiaires', stagiaireRoutes);
//manage api formateur routes
app.use('/api/formateurs', formateurRoutes);
//manage api poles routes
app.use('/api/poles', polesRoutes);
//manage api filiere routes
app.use('/api/filieres', filiereRoutes);

const PORT = process.env.PORT || 5001;

// Verify DB connection at startup so errors appear in Render logs
async function verifyDatabaseAndStart() {
    try {
        // run a simple query to ensure the pool can connect
        await pool.query('SELECT 1');
        console.log('Database connected successfully');
    } catch (err) {
        console.error('Database connection failed at startup:', err && err.message ? err.message : err);
        // Exit so Render shows the failure and restarts (adjust if you prefer to keep running)
        process.exit(1);
    }

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

verifyDatabaseAndStart();
