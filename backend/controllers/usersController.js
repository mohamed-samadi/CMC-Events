const pool = require('../db');
const bcrypt = require('bcryptjs'); 
const jwt = require("jsonwebtoken");
const transporter = require('../SendEmail/mailer') ;
const sendEmail = require('../SendEmail/transporter') ;

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

const getUserByEmailPwd = async (req , res )=>{
        try{
            const {email , password} = req.body ;
            const [rows] = await pool.query('SELECT *  FROM users WHERE email = ?' , [email] );
            if (rows.length === 0){
                res.status(401).json({ message: "utilisateur avec cette email n'exists pas" });
            };
             const user = rows[0];

            //  compare passwords
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                    return res.status(401).json({ message: "mot de passe invalide" });
                }
                
            // create JWT
                const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role , name: user.name },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
                );

                // response
                res.status(200).json({
                message: "Login réussi",
                token,
                expiresIn: "1h",
                tokenType: "Bearer", //Very important for HTTP standards
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role ,
                    name: user.name
                }
                });
                
                
        }catch(error){
            res.status(500).json({ error: 'Échec de la récupération des users ' });
        }
}




const sendEmailToUser = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const [rows] = await pool.query(
      "SELECT id, email FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message : "Utilisateur avec cet email n'existe pas",
      });
    }

    const user = rows[0];

    // Generate verification code
    const verificationCode = Math.floor(1000 + Math.random() * 9000);

    // (IMPORTANT) Save code in DB with expiration
    await pool.query(
      "UPDATE users SET reset_code = ?, reset_code_expire = DATE_ADD(NOW(), INTERVAL 10 MINUTE) WHERE id = ?",
      [verificationCode, user.id]
    );

    // Prepare email
    const from = `"CMC Events" <${process.env.GMAIL_USER}>`;
    const to = user.email;
    const subject = "Code de vérification pour réinitialisation de mot de passe";
    const message = `Votre code de vérification est : ${verificationCode}`;

    //  Send email
    const mail = await sendEmail(from, to, subject, message);

    if (!mail.sent) {
      throw new Error(mail.error);
    }

    res.status(200).json({
      message: "Email envoyé avec succès",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de l'envoi de l'email",
    });
  }
};


const checkCodeEmail = async (req, res) => {
  try {
    const { email, code } = req.body;
    // Find user by email and code
    const [rows] = await pool.query(
      "SELECT id FROM users WHERE email = ? AND reset_code = ? AND reset_code_expire > NOW()",
      [email, code]
    );
    if (rows.length === 0) {
      return res.status(400).json({ message: "Code invalide ou expiré" });
    }   
    res.status(200).json({ message: "Code vérifié avec succès" });
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la vérification du code" });
  }
};

const changeUserPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        // Update password in DB   
        const [result] = await pool.query(
            "UPDATE users SET password = ?, reset_code = NULL, reset_code_expire = NULL WHERE email = ?",
            [hashedPassword, email]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        res.status(200).json({ message: "Mot de passe mis à jour avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la mise à jour du mot de passe" });
    }
};

module.exports = {
    updateUserPassword , getUserByEmailPwd , sendEmailToUser , checkCodeEmail , changeUserPassword
};
