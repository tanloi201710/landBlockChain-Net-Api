const nodemailer = require('nodemailer')

const sendMail = (to, subject, text, html) => {

    const hostMail = 'node-send-1019@outlook.com.vn'

    const transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
            user: hostMail,
            pass: process.env.MAIL_PASS
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

        console.log(info)
        return true
    })
}

module.exports = sendMail
