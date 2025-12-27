const transporter = require("./mailer");


// const sendEmail = async (req, res) => {
//   const { to, subject, message } = req.body;

//   try {
//     await transporter.sendMail({
//       from: process.env.GMAIL_USER,
//       to,
//       subject,
//       text: message,
//     });

//     res.status(200).json({ success: true, message: "Email sent successfully ✅" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Failed to send email ❌" });
//   }
// } ;


const sendEmail = async (from , to , subject , message)=>{
    try{
       await transporter.sendMail({
      from: from ,
      to,
      subject,
      text: message,
    });
      return {sent : true} ;
    }catch(err){
      return  {sent : false , error : 'error happens to send code' } ;  
    }
}

module.exports = sendEmail

// app.post("/send-email", sendEmail );


