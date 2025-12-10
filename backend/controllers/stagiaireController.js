const pool = require('../db');
// require('dotenv').config();
const bcrypt = require('bcryptjs'); // use bcrypt for password hashing


const getAllStagiaires =  async (req , res)=>{
    try{
        const [rows] = await pool.query('SELECT * FROM stagiaires');
        res.status(200).send(rows);
    }catch(error){
        res.status(500).json({ error: 'Échec de la récupération des stagiaires' });
    }
};

const deleteStagiaire = async (req, res) => {
    try {
        const { id } = req.params;          
        const [result] = await pool.query('DELETE FROM stagiaires WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Stagiaire non trouvé' });
        }
        res.status(200).json({ message: 'Stagiaire supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Échec de la suppression du stagiaire' });
    }
};


const createStagiaire = async (req, res) => {
    
    try {
        const { first_name, last_name, email, CEF, groupe_id } = req.body;
        // 1. Check if stagiaire exists
        const [existing] = await pool.query(
            'SELECT id FROM stagiaires WHERE email = ?',
            [email]
        );
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Un stagiaire avec cet email existe déjà' });
        }

        const hashedPassword = bcrypt.hashSync(process.env.DEFAULT_PASSWORD, 10);

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
        res.status(500).json({ error: 'Échec de la création du stagiaire' });
    }
};


const getStagiaireById = async (req, res) => {
    try {
        const { id } = req.params;  
        const [rows] = await pool.query('SELECT * FROM stagiaires WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Stagiaire non trouvé' });
        }
        res.status(200).json(rows[0]);
    }
    catch (error) {
        res.status(500).json({ error: 'Échec de la récupération du stagiaire' });
    }
};


const updateStagiaire = async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, email, CEF, groupe_id } = req.body;
        const [resultStagaire] = await pool.query(
            'UPDATE stagiaires SET first_name = ?, last_name = ?, email = ?, CEF = ?, groupe_id = ? WHERE id = ?',
            [first_name, last_name, email, CEF, groupe_id, id]
        );
        if (resultStagaire.affectedRows === 0) {
            return res.status(404).json({ error: 'Stagiaire non trouvé' });
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

        res.status(200).json({ message: 'Stagiaire mis à jour avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Échec de la mise à jour du stagiaire' });
    }
};


module.exports = {
    getAllStagiaires,
    getStagiaireById ,
    deleteStagiaire,
    createStagiaire,
    updateStagiaire
};