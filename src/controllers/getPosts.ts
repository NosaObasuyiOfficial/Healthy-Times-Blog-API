import express, { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../model/userModel'

/* -----------------------------------GET ALL BLOG POST----------------------------------------*/
export const get_all_posts = async(req:Request, res:Response) => {
    try{
        const token: any = req.headers.authorization
        const token_info = token.split(" ")[1];
        const decodedToken: any = jwt.verify(token_info, process.env.APP_SECRET!);

        if(decodedToken){
            const user_id = decodedToken.id

            const user_validation:any = await User.findOne({
                where: {
                    id: user_id
                }
            })

            if(user_validation){
                const user_role = user_validation.role
        
                    if(user_role === "user"){
                        const user_name = user_validation.userName

                       const user_posts = user_validation.posts
                       const all_user_posts:any = []
                        if(user_posts.length === 0){
                            return res.status(200).json({
                                message: `User has no created POSTS`
                            })
                        }else if(user_posts.length > 0){
                            user_posts.map((posts:any) =>{
                                for(let key in posts){
                                    if(posts[key] === user_name){
                                        all_user_posts.push(posts)

                                        return res.status(200).json({
                                            message: `You have SUCESSFULLY gotten all posts from ${user_name}`,
                                            data: all_user_posts
                                        })
                                    }else{
                                        return res.status(400).json({
                                            message: `You are not AUTHORIZED to view these posts.`
                                        })
                                    }
                                }
                            })
                        }
                    }else{
                        return res.status(400).json({
                            message: `You are not a registered as a user.`
                        })
                    }
            }else{
                return res.status(400).json({
                    message: `User Details NOT FOUND.`
                })
            }
        }else{
            return res.status(500).json({
                message: `Token VERIFICATON FAILED`
            })
        }
    }catch(error){
        console.error("Error creating post:", error);
        return res.status(500).json({ error: "Internal server error - Error creating post" });  
    }
}

/* -----------------------------------GET SINGLE BLOG POST----------------------------------------*/
export const get_single_post = async(req:Request, res:Response) => {
    try{
        const token: any = req.headers.authorization
        const token_info = token.split(" ")[1];
        const decodedToken: any = jwt.verify(token_info, process.env.APP_SECRET!);

        if(decodedToken){
            const user_id = decodedToken.id

            const user_validation:any = await User.findOne({
                where: {
                    id: user_id
                }
            })

            if(user_validation){
                const user_role = user_validation.role
        
                    if(user_role === "user"){
                        const { title } = req.params
                        const user_name = user_validation.userName

                       const user_posts = user_validation.posts
                       const single_post:any = []
                        if(user_posts.length === 0){
                            return res.status(200).json({
                                message: `User has no created POSTS`
                            })
                        }else if(user_posts.length > 0){
                            user_posts.map((post:any) =>{
                                for(let key in post){
                                    if(post[key] === user_name){
                                        if(post[key] === title){
                                            if(user_posts.length > 0){
                                                single_post.push(post)

                                                return res.status(200).json({
                                                    message: `You have SUCESSFULLY gotten all posts from ${user_name}`,
                                                    data: single_post
                                                })
                                            }else{
                                                return res.status(200).json({
                                                    message: `There no posts with tite - ${title}`
                                                })
                                            }
                                        }
                                    }else{
                                        return res.status(400).json({
                                            message: `You are not AUTHORIZED to view these posts.`
                                        })
                                    }
                                }
                            })
                        }
                    }else{
                        return res.status(400).json({
                            message: `You are not a registered as a user.`
                        })
                    }
            }else{
                return res.status(400).json({
                    message: `User Details NOT FOUND.`
                })
            }
        }else{
            return res.status(500).json({
                message: `Token VERIFICATON FAILED`
            })
        }
    }catch(error){
        console.error("Error creating post:", error);
        return res.status(500).json({ error: "Internal server error - Error creating post" });  
    }
}