const pool = require('../db');

const getAllFiliere =  async (req , res)=>{
    try{
        const [rows] = await pool.query('SELECT * FROM filieres');
        res.status(200).send(rows);
    }catch(error){
        res.status(500).json({ error: 'Échec de la récupération des filiers' });
    }
};

const deleteFiliere = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM filieres WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'filier non trouvé' });
        }   
        res.status(200).json({ message: 'filier supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Échec de la suppression du filier' });
    }
};

const createFiliere = async (req, res) => {
    try {
        const { name , pole_id } = req.body;
        const [existing] = await pool.query(
            'SELECT id FROM poles WHERE name = ?',
            [name]
        );
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Un filier avec ce nom existe déjà' });
        }
        const [result] = await pool.query(
            'INSERT INTO filieres (name, pole_id) VALUES (?, ?)',
            [name , pole_id]
        );  
        res.status(201).json({
            id: result.insertId,
            name,
            pole_id
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Échec de la création du filier' });
    }   
};

const getFiliereById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM filieres WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'filier non trouvé' });
        }
        res.status(200).json(rows[0]);
    }   
    catch (error) {
        res.status(500).json({ error: 'Échec de la récupération du filier' });
    }

};

const updateFiliere = async (req, res) => {
    try {
        const { id } = req.params;
        const { name , pole_id } = req.body;
        const [result] = await pool.query(
            'UPDATE filieres SET name = ? , pole_id = ? WHERE id = ?',
            [name , pole_id , id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'filier non trouvé' });
        }
        res.status(200).json({ message: 'filier mis à jour avec succès' });
    }
    catch (error) {
        res.status(500).json({ error: 'Échec de la mise à jour du filier' });
    }
};
module.exports = {
    getAllFiliere,
    deleteFiliere,
    createFiliere,
    getFiliereById,
    updateFiliere
};