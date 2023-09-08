import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: process.env.DEV_GMAIL_USER,
        pass: process.env.DEV_GMAIL_PASSWORD
    },
    tls:{
        rejectUnauthorized: false
    }
})

export const sendmail = async(from:string, to:string, subject:string, html:string)=>{
    try{
        const reponse = await transporter.sendMail({
            from: process.env.DEV_GMAIL_USER,
            to,
            subject,
            html,
        })
    }catch(err){
        console.log(err)
    
    }
}

export const emailHtmlForUser = (user_name:string, token:string)=>{
    const mail = `
                  <h4>Dear ${user_name},<h4><br>
                    <img src = "https://www.thinklocal.co.za/images/AFrqS4eNQ4sQKjhx/1476189587_140058_fs.jpg" alt = "healthy times logo" style = "width:150px; height:70px">
                    <h2>Verify your email</h2><br>
                    <p>Click the button below to login. Your link expires in 24 hours.</p><br>
                    <a href = "http://localhost:4070/user/confirmation/${token}">
                    <button style = "color:white; padding: 6px 23px; border: 2px solid red; background-color:red; text-align:center; border-radius:4px">VERIFY</button>
                    </a>
                    <br>
                    <p style = "padding-top: 5px">If you're having troubles with the button above, <a href = "http://localhost:4070/user/confirmation/${token}"><span style = "color:red">click here</span></a></p>
                    <p style = "padding-top: 7px">Powered by <span style = "color:red; font-size:16px" >Heål†h¥ †imeś<span/></p>`

                    return mail
}

// <img src = "../../images/ht_logo.png" >
// <button style = "color:red">VERIFY</button><br>

// export const emailHtmlForUser = (user_name:string, token:string)=>{
//     const mail = `
//                   <h4>Dear ${user_name},<h4><br>
//                     <img src = "https://www.thinklocal.co.za/images/AFrqS4eNQ4sQKjhx/1476189587_140058_fs.jpg" alt = "healthy times logo" style = "width:150px; height:70px">
//                     <h2>Verify your email</h2><br>
//                     <p>Click the button below to login. Your link expires in 30 minutes.</p><br>
//                     <a href = "http://localhost:4070/user/confirmation/${token}">
//                     <button style = "color:white; padding: 6px 23px; border: 2px solid red; background-color:red; text-align:center; border-radius:4px">VERIFY</button>
//                     </a>
//                     <br>
//                     <p style = "padding-top: 5px">If you're having troubles with the button above, <a href = "http://localhost:4070/user/confirmation/${token}"><span style = "color:red">click here</span></a></p>
//                     <p style = "padding-top: 7px">Powered by <span style = "color:red" >Heål†h¥ †imeś<span/></p>`

//                     return mail
// }