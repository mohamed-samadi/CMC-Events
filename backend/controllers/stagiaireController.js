const pool = require('../db');
require('dotenv').config();
const bcrypt = require('bcrypt'); // use bcrypt for password hashing


const getAllStagiaires =  async (req , res)=>{
    try{
        const [rows] = await pool.query('SELECT * FROM stagiaires');
        res.status(200).send(rows);
    }catch(error){
        res.status(500).json({ error: 'Failed to fetch stagiaires' });
    }
};

const deleteStagiaire = async (req, res) => {
    const { id } = req.params;          
    try {
        const [result] = await pool.query('DELETE FROM stagiaires WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Stagiaire not found' });
        }
        res.status(200).json({ message: 'Stagiaire deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete stagiaire' });
    }
};


const createStagiaire = async (req, res) => {
    const { first_name, last_name, email, CEF, groupe_id } = req.body;

    try {
        // 1. Check if stagiaire exists
        const [existing] = await pool.query(
            'SELECT id FROM stagiaires WHERE email = ?',
            [email]
        );
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Stagiaire with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(process.env.DEFAULT_PASSWORD, 10);

        //  Create user
        const [userResult] = await pool.query(
            'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
            [email, hashedPassword, 'STAGIAIRE']
        );
        const userId = userResult.insertId;

        // Create stagiaire
        await pool.query(
            'INSERT INTO stagiaires (id, first_name, last_name, email, CEF, groupe_id) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, first_name, last_name, email, CEF, groupe_id]
        );

        res.status(201).json({
            id: userId,
            first_name,
            last_name,
            email,
            CEF,
            groupe_id
        });

    } catch (error) {
        console.error("Error creating stagiaire:", error);
        res.status(500).json({ error: 'Failed to create stagiaire' });
    }
};


const getStagiaireById = async (req, res) => {
    const { id } = req.params;  
    try {
        const [rows] = await pool.query('SELECT * FROM stagiaires WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Stagiaire not found' });
        }
        res.status(200).json(rows[0]);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch stagiaire' });
    }
};


const updateStagiaire = async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, email, CEF, groupe_id } = req.body;
    try {
        const [resultStagaire] = await pool.query(
            'UPDATE stagiaires SET first_name = ?, last_name = ?, email = ?, CEF = ?, groupe_id = ? WHERE id = ?',
            [first_name, last_name, email, CEF, groupe_id, id]
        );
        if (resultStagaire.affectedRows === 0) {
            return res.status(404).json({ error: 'Stagiaire not found' });
        }
        const [resultUser] = await pool.query(
            'UPDATE users SET email = ? WHERE id = ?',
            [email, id]
        );

        res.status(200).json({ message: 'Stagiaire updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update stagiaire' });
    }
};


module.exports = {
    getAllStagiaires,
    getStagiaireById ,
    deleteStagiaire,
    createStagiaire,
    updateStagiaire
};