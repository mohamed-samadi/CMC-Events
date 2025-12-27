// const pool = require('./db') ;
// const  bcrypt  = require('bcryptjs') ;



// const login = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         if (!email || !password) {
//             return res.status(400).json({ error: "Email et mot de passe sont requis" });
//         }

//         // Find user
//         const [users] = await pool.query(
//             "SELECT * FROM users WHERE email = ?",
//             [email]
//         );

//         if (users.length === 0) {
//             return res.status(404).json({ error: "Email incorrect" });
//         }

//         const user = users[0];

//         // Compare password
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(401).json({ error: "Mot de passe incorrect" });
//         }

     

//         res.status(200).json({
//             message: "Connexion réussie",
//             user: {
//                 id: user.id,
//                 role: user.role ,
//                 email: user.email
//             }
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Erreur serveur lors de la connexion" });
//     }
// };

// module.exports = { login };


