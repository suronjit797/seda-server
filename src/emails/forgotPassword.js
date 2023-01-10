

const forgotPassword = (name, link) => {
    return `
    <!DOCTYPE html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <meta name="x-apple-disable-message-reformatting">
        <title></title>
        <!--[if mso]>
        <noscript>
            <xml>
                <o:OfficeDocumentSettings>
                    <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
            </xml>
        </noscript>
        <![endif]-->
        <style>
            table,
            td,
            div,
            h1,
            p {
                font-family: Arial, sans-serif;
            }
        </style>
    </head>
    
    <body style="margin:0;padding:0;">
        <table role="presentation"
            style="width:100%;border-collapse:collapse;border:0;border-spacing:0;background:#ffffff;padding:30px">
            <tr>
                <td align="center" style="padding:0;">
                    <table role="presentation"
                        style="width:602px;border-collapse:collapse;border:1px solid #cccccc;border-spacing:0;text-align:left;">
    
                        <tr>
                            <td style="padding:36px 30px 0px 30px;">
                                <table role="presentation"
                                    style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">
                                    <tr>
                                        <td style="padding:0px;color:#153643;">
                                            <h1 style="font-size:18px;margin:0 0 20px 0;font-family:Arial,sans-serif;">
                                                Dear ${name},</h1>
                                                <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;">
                                                Seems like you forgot your password for SEDA OEMS.
                                                </p>
                                            <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;">
                                                If you didn't make this request, just ignore this email. Otherwise, you can reset your password.</p>
                                            <h3 style="font-size:15px;font-family:Arial,sans-serif;">Click Link to Reset
                                                Password:</h3>
                                            <p
                                                style="margin:0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;">
                                                <a href=${link} style="color:#00205b;text-decoration:underline;">Reset
                                                    password link</a>
                                            </p>
                                            <h3 style="font-size:15px;font-family:Arial,sans-serif;">If You Did Not Request
                                                for A Password Reset:</h3>
                                            <p style="font-size:16px;font-family:Arial,sans-serif;">You can ignore this
                                                email.</p>
                                            <p style="font-size:16px;font-family:Arial,sans-serif;">Best Regards,</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:30px;">
                                <table role="presentation"
                                    style="width:100%;border-collapse:collapse;border:0;border-spacing:0;font-size:9px;font-family:Arial,sans-serif;">
                                    <tr>
                                        <td style="padding:0;width:25%;" align="left">
                                            <img src="https://seda.ivis.com.my/images/logo.png" alt="logo"
                                                style="height:100px">
                                        </td>
                                        <td style="padding:0;width:75%;">
                                            <table role="presentation"
                                                style="border-collapse:collapse;border:0;border-spacing:0;">
                                                <tr>
                                                    <td>
                                                        <p
                                                            style="font-size:16px;font-family:Arial,sans-serif;padding:0px;margin:0px;">
                                                            Administrator,</p>
                                                        <p
                                                            style="font-size:16px;font-family:Arial,sans-serif;padding:0px;margin:0px;">
                                                            SEDA Online Energy Monitoring Cloud Platform</p>
                                                        <p
                                                            style="font-size:16px;font-family:Arial,sans-serif;padding:0px;margin:0px;">
                                                            Customer Care Line : +603 8870 5800</p>
                                                        <p
                                                            style="font-size:16px;font-family:Arial,sans-serif;padding:0px;margin:0px;">
                                                            Customer Care Email : <a href="mailto:tech@seda.gov.my">tech@seda.gov.my</a></p>
                                                    </td>
    
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                                <table style="margin-top:20px">
                                    <tr>
                                        <td>
                                            <h3 style="font-size:15px;font-family:Arial,sans-serif;margin:0px;">
                                                Sustainable Energy Development Authority (SEDA) Malaysia</h3>
                                        </td>
                                    </tr>
                                </table>
                                <hr />
                                <p style="font-size:13px;font-family:Arial,sans-serif;padding:0px;">
                                    Galeria PjH, Aras 9, Jalan P4W, Persiaran Perdana, Presint 4, 62100 Putrajaya, Malaysia.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>`
}

export default forgotPassword;