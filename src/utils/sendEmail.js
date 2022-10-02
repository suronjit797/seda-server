import nodemailer from "nodemailer"

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            pool: true,
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: true, // use TLS
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
          });

        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            text: text,
        });

        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

export default sendEmail;