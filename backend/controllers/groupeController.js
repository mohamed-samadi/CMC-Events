const pool = require('../db');


const gatAllgroupes =  async (req , res)=>{
    try{
        const [rows] = await pool.query('SELECT * FROM groupes');
        res.status(200).send(rows);
    }catch(error){
        res.status(500).json({ error: 'Échec de la récupération des groupes' });
    }
};

const deleteGroupe = async (req, res) => {
    
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM groupes WHERE id = ?', [id]);    
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Groupe non trouvé' });
        }
        res.status(200).json({ message: 'Groupe supprimé avec succès' });
    }
    catch (error) {
        res.status(500).json({ error: 'Échec de la suppression du groupe' });
    }
};
const createGroupe = async (req, res) => {
   
    try {
         const { name , filiere_id } = req.body;
        const [existing] = await pool.query(
            'SELECT id FROM groupes WHERE name = ?',
            [name]
        );
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Un groupe avec ce nom existe déjà' });
        }
        const [result] = await pool.query(
            'INSERT INTO groupes (name, filiere_id) VALUES (?, ?)',
            [name , filiere_id]
        );  
        res.status(201).json({
            id: result.insertId,
            name,
            filiere_id
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Échec de la création du groupe' });
    }   
};

const getGroupeById = async (req, res) => {
    try {
        const { id } = req.params;  
        const [rows] = await pool.query('SELECT * FROM groupes WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Groupe non trouvé' });
        }
        res.status(200).json(rows[0]);
    }   
    catch (error) {
        res.status(500).json({ error: 'Échec de la récupération du groupe' });
    }
};

const updateGroupe = async (req, res) => {
   
    try {
         const { id } = req.params;
        const { name , filiere_id } = req.body;
        const [result] = await pool.query(
            'UPDATE groupes SET name = ?, filiere_id = ? WHERE id = ?',
            [name , filiere_id , id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Groupe non trouvé' });
        }
        res.status(200).json({ message: 'Groupe mis à jour avec succès' });
    }   
    catch (error) {
        res.status(500).json({ error: 'Échec de la mise à jour du groupe' });
    }
};

module.exports = {
    gatAllgroupes,
    deleteGroupe,
    createGroupe,
    getGroupeById,
    updateGroupe
};