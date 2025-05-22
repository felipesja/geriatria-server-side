'use strict';
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const cors = require('cors')({ origin: true });

require('dotenv').config();

let transporter = nodemailer.createTransport({
  service: 'Gmail', // no need to set host or port etc.
  auth: {
    user: process.env.USER,
    pass: process.env.PASSWORD
  }
});

exports.enviarEmail = functions.https.onRequest((req, res) => {
  cors(req, res, () => {

    const { email = '', name = '', telefone = '', message = '' } = req.body;

    const from = name && email ? `${name} <${email}>` : `${name || email}`;

    let htmlBody = `<b>Informações do Contato</b><br><br>
                    <b>Nome: </b>${name}<br>
                    <b>Telefone: </b>${telefone}<br>
                    <b>E-mail: </b>${email}<br><br>
                    <b>Mensagem: </b><br>
                    <p>${message}</p>`;

    const messageEmail = {
      from,
      to: process.env.TO,
      subject: `Novo contato de ${from} realizado através do site`,
      message,
      replyTo: from,
      html: htmlBody
    };

    transporter.sendMail(messageEmail, (error, info) => {
      if (error) {        
        res.status(500).send(error);
      } else {
        res.status(200).send("Sucess");
      }
    });
  });
});