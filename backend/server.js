const express = require('express');
const app = express();
const cors = require("cors");

const pool = require('./db');
app.use(cors())
app.use(express.json());
const stagiaireRoutes = require('./routes/stagiaireRoutes');
app.get('/', (req, res) => {
    res.send('API is working');
});




// app.get('/stagiaires', getAllStagiaires);
// app.get('/stagiaires/:id', getStagiaireById);
// app.delete('/stagiaires/:id', deleteStagiaire);
// app.post('/stagiaires', createStagiaire);
// app.put('/stagiaires/:id', updateStagiaire);


//manage api stagiaire routes
app.use('/api/stagiaires', stagiaireRoutes);


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
