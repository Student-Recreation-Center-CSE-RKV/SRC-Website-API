const nodemailer = require('nodemailer');
const{EMAIL_ID,EMAIL_PASS}=require('../config/serverConfig');

const transporter = nodemailer.createTransport({
    service:'Gmail',
    auth:{
        user:EMAIL_ID,
        pass:EMAIL_PASS
    }
});

 async function sendVerificationEmail(to,token,flag) {
    var url='';
    if(flag=='verify'){
        url = `http://localhost:3001/api/v1/verify/${token}`;
    }
    else{
        url = `http://localhost:3001/api/v1/reset/password/${token}`;
    }

    const mailOptions = {
        from: 'airlineremainder@gmail.com',
        to,
        subject: 'SRC website Support',
        html: `<h3>Click the link to ${flag}</h3><a href="${url}">${url}</a>`
    };

 await transporter.sendMail(mailOptions);
}

module.exports = { sendVerificationEmail };
