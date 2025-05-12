const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (to, name) => {
    const msg = {
        to,
        from: 'tomarchios00@gmail.com',
        subject: 'Benvenuto su Strive Blog!',
        text: `Ciao ${name}, grazie per esserti registrato!`,
    };
    return sgMail.send(msg);
};

const sendNewPostNotification = (to, postTitle) => {
    const msg = {
        to,
        from: 'tomarchios00@gmail.com',
        subject: 'Hai pubblicato un nuovo articolo!',
        text: `Hai appena pubblicato "${postTitle}" su Strive Blog.`,
    };
    return sgMail.send(msg);
};

module.exports = { sendWelcomeEmail, sendNewPostNotification };
