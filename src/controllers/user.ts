import { Request, Response } from 'express'
import { user_signup, user_login, user_updates } from '../utilities/inputValidation'
import User, {IUSER} from '../model/userModel'
import { hashedPassword } from '../utilities/auth'
import {v4} from 'uuid'
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { sendmail, emailHtmlForUser } from '../utilities/notification'

dotenv.config()

export const user_Signup = async(req:Request, res:Response) => {

    try{
        const schema = user_signup
        const { error, value } = schema.validate(req.body);
        if (error) {
          return res.status(400).json({ message: error.details[0].message });
        }
    
        const { email, password, userName, firstName, lastName, city, state, zip, country, posts } = req.body

        const checking_existing_user = await User.findOne({
            where: { email:email.trim() }
        })

        if(checking_existing_user){
            res.status(400).json({
                message: `Account already exists. Kindly login.`
            })
        }else{
            const checking_exisiting_userName = await User.findOne({
                where: { userName: userName.trim()}
            })

            if(checking_exisiting_userName){
                res.status(400).json({
                    message: `Username already taken. Kindly input a different username.`
                })
            }else{
                const hashPassword = await hashedPassword(password.trim())

                const create_user = await User.create({
                    id: v4(),
                    userName:userName.trim(),
                    firstName,
                    lastName,
                    email,
                    password: hashPassword,
                    city,
                    state,
                    zip,
                    country,
                    verification: false,
                    role: "user",
                    posts: []
                })
    
                const get_user_details = await User.findOne({
                    where: { email }
                }) as unknown as IUSER
    
                const user_id = get_user_details.id
                const user_name = get_user_details.userName
    
                const token = jwt.sign({ id: user_id }, process.env.APP_SECRET!,
                    { expiresIn: "1d" }
                  );
    
                  const html = emailHtmlForUser(user_name, token);
                  const sent_mail = await sendmail(
                    `${process.env.GMAIL_USER}`,
                    email,
                    "Verify your email",
                    html
                  );
        
                res.status(200).json({
                    message: `ACCOUNT CREATED SUCCESSFULLY. Kindly confirm email and login.`,
                    data: create_user,
                    signup_token: token
                })
            }
        }
    }catch(error){
        console.error("Error creating user:", error);
        return res.status(500).json({ error: "Internal server error" });      
    }
}

export const user_verification = async(req:Request, res:Response) => {

    try{
        const token: any = req.headers.authorization
        const token_info = token.split(" ")[1];
        const decodedToken: any = jwt.verify(token_info, process.env.APP_SECRET!);

        if(decodedToken){

            const main_token = token.slice(7)
            const { signup_token } = req.params

            if(main_token !== signup_token){

                return res.status(500).json({
                    message: `Cannot verify user. Check verification code`
                })
            }else{
                const user_id = decodedToken.id

                const update_user_verification = await User.update({ verification: true }, { where: { id: user_id } });
        
                if(update_user_verification){
                    return res.status(200).json({
                        message: `Verification SUCCESSFUL`
                    })
                }else{
                    return res.status(400).json({
                        message: `Unable to verify user`
                    })
                }
            }
        }else{
            return res.status(500).json({
                message: `Require token for authentication`
            })
        }
    }catch(error){
        console.error("Error verifying user:", error);
        return res.status(500).json({ error: "Internal server error" });      
    }
}

export const user_Login = async(req:Request, res:Response) => {
    try{
        const schema = user_login
        const { error, value } = schema.validate(req.body);
        if (error) {
          return res.status(400).json({ message: error.details[0].message });
        }

        const {email, password} = req.body

        const user_authentication:any = await User.findOne({
            where: {
                email
            }
        })

        if(user_authentication){
            const user_verification_status = user_authentication.verification

            if(user_verification_status === true){

                const validate_user = await bcrypt.compare(password, user_authentication.password);
                if(validate_user){
         
                    const token = jwt.sign({ id: user_authentication.id }, process.env.APP_SECRET!,
                        { expiresIn: "1d" }
                      );

                    return res.status(200).json({
                        message:`LOGIN SUCCESSFUL`,
                        userName: user_authentication.userName,
                        token: token
                    })
                      
                }else{
                    return res.status(400).json({
                        message: `Incorrect password details.`
                    })
                }
            }else{
                return res.status(400).json({
                    message: `Please verify your email before logging in`
                })
            }
        }else{
            return res.status(400).json({
                message: `User Details NOT FOUND`
            })
        }

    }catch(error){
        console.error("Error logging-in user:", error);
        return res.status(500).json({ error: "Internal server error" });  
    }
}

export const user_profile_update = async(req:Request, res:Response) => {
    try{
        const token: any = req.headers.authorization
        const token_info = token.split(" ")[1];
        const decodedToken: any = jwt.verify(token_info, process.env.APP_SECRET!);
        
        if(decodedToken){

            const schema = user_updates
            const { error, value } = schema.validate(req.body);
            if (error) {
              return res.status(400).json({ message: error.details[0].message });
            }

            const { firstName, lastName, city, state, zip, country } = req.body

            const user_id = decodedToken.id

            const user_validation:any = await User.findOne({
                where: {
                    id:user_id
                }
            })
            if(user_validation){
                const user_role = user_validation.role
                const user_email = user_validation.email
                if(user_role === "user"){

                    const user_update_profile = await User.update({ firstName:firstName.trim(), lastName:lastName.trim(), city:city.trim(), state:state.trim(), zip, country:country.trim()},
                        {
                          where: {
                            email:user_email 
                          }
                        });

                        if(user_update_profile){

                            const user_update = await User.findOne({
                                where: {
                                  id: user_id
                                }
                              });

                            return res.status(200).json({
                                message: `Profile has been UPDATED successfully`,
                                data: user_update
                            })
                            
                        }else{
                            return res.status(400).json({
                                message: `update PROFILE FAILED.`
                            })
                        }
                }else{
                    return res.status(400).json({
                        message: `You are not registered as a USER.`
                    })
                }
            }else{
                return res.status(400).json({
                    message: `User details not FOUND.`
                })
            }
        }else{
            return res.status(500).json({
                message: `Require token for authentication.`
            })
        }
    }catch(error){
        console.error("Error updating user profile:", error);
        return res.status(500).json({ error: "Internal server error" });  
    }
}











































