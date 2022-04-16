const nodemailer = require('nodemailer')

const sendMail = (to, subject, text, html) => {

    const hostMail = 'node-send-1019@outlook.com.vn'

    const transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com", // hostname
        secureConnection: false, // TLS requires secureConnection to be false
        port: 587, // port for secure SMTP
        tls: {
            ciphers: 'SSLv3'
        },
        auth: {
            user: hostMail,
            pass: 'outHt148#Li'
        }
    })

    const options = {
        from: hostMail,
        to,
        subject,
        text,
        html
    }

    transporter.sendMail(options, (err, info) => {
        if (err) {
            console.log('ERROR: ' + err)
            return false
        }

        console.log(info.response)
        return true
    })

}

module.exports = sendMail
