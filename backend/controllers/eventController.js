const pool = require('../db');

const getAllevents = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM events');
        res.status(200).send(rows);
    } catch (error) {
        res.status(500).json({ error: 'Échec de la récupération des événements' });
    }
};

const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM events WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Événement non trouvé' });
        }
        res.status(200).json({ message: 'Événement supprimé avec succès' });
    } catch (error) {   
        res.status(500).json({ error: "Échec de la suppression de l'événement" });
    }
};

const createEvent = async (req, res) => {   
    try {
        const { title, description, date_start , date_end , location, created_by } = req.body;
        const [result] = await pool.query(

            'INSERT INTO events (title, description, date_start, date_end, location, created_by) VALUES (?, ?, ?, ?, ?, ?)',
            [title, description, date_start , date_end , location, created_by]
        );
        res.status(201).json({
            id: result.insertId,
            title,
            description,
            date_start,
            date_end,
            location,
            created_by
        });
    } catch (error) {
        res.status(500).json({ error: "Échec de la création de l'événement" });
    }
};

const getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Événement non trouvé" });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Échec de la récupération de l'événement" });
    }
};
