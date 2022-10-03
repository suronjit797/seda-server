import nodemailer from "nodemailer"

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'mail.hthreetech.com',
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: 'seda@hthreetech.com',
                pass: '8KNoPdqwaEei'
            }
        });
        // verify connection configuration
        transporter.verify(function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log("Server is ready to take our messages");
            }
        });
        const mailOptions = {
            from: '"SEDA Team" <seda@hthreetech.com>',
            to: email,
            subject: subject,
            text: text,
            html: text
          };
        await transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

export default sendEmail;