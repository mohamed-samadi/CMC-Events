const pool = require('../db');
const bcrypt = require('bcryptjs'); // use bcrypt for password hashing

const getAllFormateurs =  async (req , res)=>{
    try{
        const [rows] = await pool.query('SELECT * FROM formateurs');    
        res.status(200).send(rows);
    }catch(error){
        res.status(500).json({ error: 'Échec de la récupération des formateurs' });
    }
};

const deleteFormateur = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM formateurs WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Formateur non trouvé' });
        }
        res.status(200).json({ message: 'Formateur supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Échec de la suppression du formateur' });
    }   
};
const createFormateur = async (req, res) => {
    try {
        const { first_name, last_name, email } = req.body;
        // 1. Check if formateur exists
        const [existing] = await pool.query(
            'SELECT id FROM formateurs WHERE email = ?',
            [email]
        );
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Un formateur avec cet email existe déjà' });
        }
        const hashedPassword = bcrypt.hashSync(process.env.DEFAULT_PASSWORD, 10);
        //  Create user
        const [userResult] = await pool.query(
            'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
            [email, hashedPassword, 'FORMATEUR']
        );
        const userId = userResult.insertId;
        // Create formateur
        await pool.query(
            'INSERT INTO formateurs (id, first_name, last_name, email) VALUES (?, ?, ?, ?)',
            [userId, first_name, last_name, email]
        );
        res.status(201).json({
            id: userId,
            first_name,
            last_name,
            email
        });
    } catch (error) {
        res.status(500).json({ error: 'Échec de la création du formateur' });
    }
};

const getFormateurById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM formateurs WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Formateur non trouvé' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Échec de la récupération du formateur' });
    }   
};
const updateFormateur = async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, email } = req.body;
        const [result] = await pool.query(
            'UPDATE formateurs SET first_name = ?, last_name = ?, email = ? WHERE id = ?',
            [first_name, last_name, email, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Formateur non trouvé' });
        }   
        const checkEmail = await pool.query(
            'SELECT id FROM users WHERE email = ? AND id != ?',
            [email, id]
        );

        if (checkEmail[0].length > 0) {
            return res.status(400).json({ error: 'Un utilisateur avec cet email existe déjà' });
        }
           const [resultUser] = await pool.query(
            'UPDATE users SET email = ? WHERE id = ?',
            [email, id]
        );
        res.status(200).json({ message: 'Formateur mis à jour avec succès' });
    }
    catch (error) {
        res.status(500).json({ error: 'Échec de la mise à jour du formateur' });
    }   
};

module.exports = {
    getAllFormateurs,
    getFormateurById,
    deleteFormateur,
    createFormateur,
    updateFormateur
};