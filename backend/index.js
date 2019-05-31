const nodemailer = require('nodemailer');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
let constants = require('./constants.js');
let { mail, name, pass } = require('./credentials');

var app = express();
var port = process.env.PORT || 3002;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/send', function(req, res) {
    if(req.body) {
        if(req.body.to) {
            var mailOptions = {
                from: name,
                to: req.body.to,
                subject: 'Customer Request from SysnxWeb ', 
                text: req.body.message,
                html: 'Email: ' +  req.body.to + '<br></br> Message: ' + req.body.message,
            };
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                secure: 'true',
                port: '465',
                auth: {
                    user: mail,
                    pass: pass
                },
            });
            try {
                transporter.sendMail(mailOptions, (err, response) => {
                    console.log("Sending mail to " + mailOptions.to + "  body ::::" + mailOptions.html);
                    if (err) {
                        console.error("Error while sending mail ", err)
                        res.send({
                            success: false,
                            data: err,
                            message: "Error while sending email To " + req.body.to
                        });
                    } else {
                        console.info("Mail send Successfully :::" + mailOptions.to)
                        res.send({
                            success: true,
                            data: response
                        });
                    }
                });
            } catch(error) {
                console.error("Error while sending mail ", error)
                res.send({
                    success: false,
                    data: {
                        message: "Error while sending mail To " + req.body.to
                    }
                });
            }
        } else {
            res.send({
                success: false,
                data: {
                    message: "Alteast one recipient is required"
                }
            }); 
        }
    } else {
        res.send({
            success: false,
            data: {
                message: "Body should not be empty for POST request"
            }
        });
    }
});
  // start the server
app.listen(port);