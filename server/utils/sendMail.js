const nodemailer = require('nodemailer');
const express = require('express');



const sendMail = async (otp,email)=> {
    
     try {
        
        const  transporter = nodemailer.createTransport({

            service:'GMAIL',
            auth: {
                user:process.env.EMAIL,
                pass:process.env.EMAIL_PASSWORD,
            }
        });

        const mailOptions = {
            from:process.env.EMAIL,
            to:email,
            subject:'reset password otp',
            html:`<div>${otp}</div>`
        }

         await transporter.sendMail(mailOptions,(error,info)=>{
            if(error){
                throw new Error('failed to send email')
            }
        })
     } catch (error) {
        console.log(error.message)
     }
};

module.exports = sendMail