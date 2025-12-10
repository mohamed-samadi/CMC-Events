const pool = require('../db');
const bcrypt = require('bcryptjs'); 

const updateUserPassword = async (req , res) => {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;

        // Check if password provided
        if (!newPassword || newPassword.trim() === "") {
            return res.status(400).json({ error: "Mot de passe est requis" });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update in database
        const [result] = await pool.query(
            `UPDATE users SET password = ? WHERE id = ?`,
            [hashedPassword, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Utilisateur introuvable" });
        }

        res.status(200).json({ message: "Mot de passe modifié avec succès" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Échec de modification du mot de passe" });
    }
};

module.exports = {
    updateUserPassword
};
