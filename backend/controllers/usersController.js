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
                res.status(401).json({ error: `utilisateur avec cette email n'exists pas` });
            };
             const user = rows[0];

            //  compare passwords
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                    return res.status(401).json({ message: "mot de passe invalide" });
                }
                
            // create JWT
                const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
                );

                // response
                res.status(200).json({
                message: "Login réussi",
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role
                }
                });
                
                
        }catch(error){
            res.status(500).json({ error: 'Échec de la récupération des users ' });
        }
}

const sendEmailToUser = async (req , res) => {
    try{
        const {email }= req.body ;
         const [rows] = await pool.query('SELECT *  FROM users WHERE email = ?' , [email] );
            if (rows.length === 0){
                res.status(401).json({ error: `utilisateur avec cette email n'exists pas` });
            };
        const user = rows[0];
        // genatare a random code
        const verificationCode = Math.floor(1000 + Math.random() * 9000);
        const from =  `"CMC Events" <${process.env.GMAIL_USER}>`
        const to = user.email ;
        const subject = "Code de vérification pour réinitialisation de mot de passe" ;
        const message = `Votre code de vérification est : ${verificationCode}`;

            // sent email to user for virifit the email
        const mail = sendEmail(from , to  , subject , message) ;
        if (mail.sent === false){
            throw Error(mail.Error)
        }

        res.status(200).json({ message: `email envoyé avec succès` , code : verificationCode });
    }catch(error){
         res.status(500).json({ error: error.message });
    }
}
module.exports = {
    updateUserPassword , getUserByEmailPwd , sendEmailToUser
};
