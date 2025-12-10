const pool = require('../db');
const bcrypt = require('bcryptjs'); 

const getAllPoles =  async (req , res)=>{
    try{
        const [rows] = await pool.query('SELECT * FROM poles');
        res.status(200).send(rows);
    }catch(error){
        res.status(500).json({ error: 'Échec de la récupération des pôles' });
    }
};

const deletePole = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM poles WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Pôle non trouvé' });
        }
        res.status(200).json({ message: 'Pôle supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Échec de la suppression du pôle' });
    }
};
const createPole = async (req, res) => {
    try {
        const { name } = req.body;
        const [existing] = await pool.query(
            'SELECT id FROM poles WHERE name = ?',
            [name]
        );
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Un pôle avec ce nom existe déjà' });
        }
        const [result] = await pool.query(
            'INSERT INTO poles (name) VALUES (?)',
            [name]
        );  
        res.status(201).json({
            id: result.insertId,
            name
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Échec de la création du pôle' });
    }
};

const getPoleById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM poles WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Pôle non trouvé' });
        }
        res.status(200).json(rows[0]);
    }
    catch (error) {
        res.status(500).json({ error: 'Échec de la récupération du pôle' });
    }
};

const updatePole = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const [result] = await pool.query(
            'UPDATE poles SET name = ? WHERE id = ?',
            [name, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Pôle non trouvé' });
        }
        res.status(200).json({ message: 'Pôle mis à jour avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Échec de la mise à jour du pôle' });
    }
};

module.exports = {
    getAllPoles,
    getPoleById,
    deletePole,
    createPole,
    updatePole
};