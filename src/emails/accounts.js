const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeMail = async (email, name) => {
  const msg = {
    to: email,
    from: 'prathyualaghari@gmail.com',
    subject: 'Welcome to the app',
    text: `Welcome ${name}`,
  }
  try {
    await sgMail.send(msg)
    console.log('Mail is sent')
  } catch (e) {
    console.log(e)
    if (e.response) {
      console.log(e.response.body)
    }
  }
}

const sendDeleteMail = async (email, name) => {
  const msg = {
    to: email,
    from: 'prathyualaghari@gmail.com',
    subject: 'Feedback mail',
    text: `Thank you ${name}`,
  }
  try {
    await sgMail.send(msg)
    console.log('Mail is sent')
  } catch (e) {
    console.log(e)
    if (e.response) {
      console.log(e.response.body)
    }
  }
}

module.exports = {
  sendWelcomeMail,
  sendDeleteMail,
}
