import express, { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../model/userModel'
import { Op } from "sequelize";

/* -----------------------------------ADD A POST----------------------------------------*/
export const create_post = async(req:Request, res:Response) => {
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
                const user_name = user_validation.userName
                const posts = user_validation.posts
                    if(user_role === "user"){

                        const { title, article } = req.body

                        const timestamp = new Date().getTime()
                        const date = new Date(timestamp)
                        const year = date.getFullYear().toString().padStart(2, "0")
                        const month = (date.getMonth()+1).toString().padStart(2, "0")
                        const transfer_date = date.getDate().toString().padStart(2, "0")
        
                        const hours = date.getHours().toString().padStart(2, "0")
                        const minutes = date.getMinutes().toString().padStart(2, "0")
                        const seconds = date.getSeconds().toString().padStart(2, "0")

                        const user_post = {
                            title,
                            by:user_name,
                            posted_At:`${year}-${month}-${transfer_date} ${hours}:${minutes}:${seconds}`,
                            article,
                            no_of_comments: 0,
                            comments:[],
                            no_of_likes: 0,
                            likes: []
                        }

                        posts.push(user_post)

                        const post_update = await User.update(
                            { posts: posts },
                            {
                                where: {
                                    [Op.and]: [
                                       { id: user_id  },
                                          { userName: user_name }
                                     ]
                                }
                            }
                          );

                    const user_data = await User.findOne({
                        where:{
                            id: user_id
                        }
                    })

                    return res.status(200).json({
                        message: `Post CREATED`,
                        data: user_data
                    })

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

/* -----------------------------------COMMENT ON A POST----------------------------------------*/
export const make_comments = async(req:Request, res:Response)=> {

    try{
        const token: any = req.headers.authorization
            const token_info = token.split(" ")[1];
            const decodedToken: any = jwt.verify(token_info, process.env.APP_SECRET!);
    
            if(decodedToken){
                const user_id = decodedToken.id

                const user_validation:any = await User.findOne({
                    where: {
                        id:user_id
                    }
                })

                if(user_validation){
                    const { comment, userName, title } = req.body

                    const target_post:any = await User.findOne({
                        where: {
                            userName
                        }
                    })

                    const timestamp = new Date().getTime()
                    const date = new Date(timestamp)
                    const year = date.getFullYear().toString().padStart(2, "0")
                    const month = (date.getMonth()+1).toString().padStart(2, "0")
                    const transfer_date = date.getDate().toString().padStart(2, "0")
    
                    const hours = date.getHours().toString().padStart(2, "0")
                    const minutes = date.getMinutes().toString().padStart(2, "0")
                    const seconds = date.getSeconds().toString().padStart(2, "0")

                    const target_post_title = target_post.posts
                    const user_Name = user_validation.userName


                    const author_info:any = await User.findOne({
                        where: {userName:userName.trim()}
                    })

                    let commented_post:any = []
                    
                    if(author_info.userName === userName.trim()){
                        const user_comment = {
                            user_name: user_Name + " " + "*author*",
                            At: `${year}-${month}-${transfer_date} ${hours}:${minutes}:${seconds}`,
                            comment: comment.trim()
                        }

                        target_post_title.map((comm:any) => {
                            for(let key in comm){
                                if(comm[key] === title.trim()){
                                    comm.comments.push(user_comment)
                                    comm.no_of_comments+=1
                                    commented_post.push(comm)
                                }
                            }
                        })
                    }else{
                        const user_comment = {
                            user_name: user_Name,
                            At: `${year}-${month}-${transfer_date} ${hours}:${minutes}:${seconds}`,
                            comment: comment.trim()
                        }

                        target_post_title.map((comm:any) => {
                            for(let key in comm){
                                if(comm[key] === title.trim()){
                                    comm.comments.push(user_comment)
                                    commented_post.push(comm)
                                }
                            }
                        })
                    }

                    await User.update({ posts: target_post_title }, { where: { userName:userName.trim() } });

                    return res.status(200).json({
                        message: `COMMENT POSTED`,
                        data: commented_post
                    })

                }else{
                    return res.status(400).json({
                        message: `User Details NOT FOUND`
                    })
                }
            }else{
                return res.status(500).json({
                    message: `Token VERIFICATON FAILED`
                })
            }
  
    }catch(error){
        console.error("Error making comments:", error);
        return res.status(500).json({ error: "Internal server error - Error making comments" });  
    }
}

/* -----------------------------------LIKE A POST----------------------------------------*/
export const like_a_post = async( req:Request, res:Response) => {
    try{
        const token: any = req.headers.authorization
        if(typeof token !== undefined){
            const token_info = token.split(" ")[1];
            const decodedToken: any = jwt.verify(token_info, process.env.APP_SECRET!);
    
            if(decodedToken){
                const user_id = decodedToken.id

                const user_validation:any = await User.findOne({
                    where: {
                        id:user_id
                    }
                })

                if(user_validation){
                    const { userName, title } = req.body

                    const target_post:any = await User.findOne({
                        where: {
                            userName:userName.trim()
                        }
                    })
                const user_name = user_validation.userName
                const targeted_posts = target_post.posts
                let liked_post:any = []

                    targeted_posts.map(async(p:any) => {
                        for(let key in p){
                            if(p[key] === title.trim()){
                                const timestamp = new Date().getTime()
                                const date = new Date(timestamp)
                                const year = date.getFullYear().toString().padStart(2, "0")
                                const month = (date.getMonth()+1).toString().padStart(2, "0")
                                const transfer_date = date.getDate().toString().padStart(2, "0")
                
                                const hours = date.getHours().toString().padStart(2, "0")
                                const minutes = date.getMinutes().toString().padStart(2, "0")
                                const seconds = date.getSeconds().toString().padStart(2, "0")

                                if(p.likes.length === 0){

                                    p.no_of_likes+=1
                                    p.likes.push(`${user_name} ${year}-${month}-${transfer_date} ${hours}:${minutes}:${seconds}`)
                                 
                                    await User.update({ posts: targeted_posts }, { where: { userName:userName.trim() } });

                                    liked_post.push(p)

                                    return res.status(200).json({
                                        message: `LIKED!`,
                                        data: liked_post
                                    })
                                }else if(p.likes.length > 0){
                                    p.likes.map(async(user:any) => {
                                   
                                        if(user !== user_name){

                                            p.no_of_likes+=1
                                            p.likes.push(`${user_name} ${year}-${month}-${transfer_date} ${hours}:${minutes}:${seconds}`)
                                        
                                            await User.update({ posts: targeted_posts }, { where: { userName:userName.trim() } });

                                            liked_post.push(p)

                                            return res.status(200).json({
                                                message: `LIKED! ♥️♥️`,
                                                data: liked_post
                                            })
                                        }
                                        else if(user === user_name){
                                            p.no_of_likes-=1
                                            for(let i = 0; i < p.likes.length; i++){
                                                if(p.likes[i] === user_name){
                                                    p.likes.splice(i, 1)
                                                }
                                            }
                                            await User.update({ posts: targeted_posts }, { where: { userName:userName.trim() } });

                                            liked_post.push(p)

                                            return res.status(200).json({
                                                message: `UN-LIKED!`,
                                                data: liked_post
                                            })
                                        }
                                    })
                                }
                            }
                        }  
                    })
                }else{
                    return res.status(400).json({
                        message: `User Details NOT FOUND`
                    })
                }
            }else{
                return res.status(500).json({
                    message: `Token VERIFICATON FAILED`
                })
            }
        }else{
            return res.status(400).json({
                message: `TOKEN NEEDED FOR AUTHORIZATION`
            })
        }


    }catch(error){
        console.error("Error liking a post:", error);
        return res.status(500).json({ error: "Internal server error - Error liking a post" });   
    }
}

/* -----------------------------------EDIT A POST----------------------------------------*/
export const edit_post = async(req:Request, res:Response) => {
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

                        const { title, article } = req.body

                       const user_posts = user_validation.posts

                       user_posts.map(async(post:any) => {

                            for(let key in post){
                                    if(post[key] === title.trim()){
                                        const post_author = post.by
                                        if(user_name === post_author){
                                            post.article = article.trim()

                                            await User.update({posts:user_posts}, { where: { userName: user_name}})
    
                                            return res.status(200).json({
                                               message: `${post.title} has been UPDATED SUCCESSFULLY`,
                                               data: post
                                            })
                                        }else{
                                            return res.status(400).json({
                                                messsage: `You are not the AUTHOR of this post`
                                            })
                                        }
                                    }
                            }
                       })
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


/* -----------------------------------DELETE A POST----------------------------------------*/

export const delete_post = async(req:Request, res:Response) => {
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

                        const { title } = req.body

                       const user_posts = user_validation.posts

                       user_posts.map(async(post:any) => {

                            for(let key in post){
                                    if(post[key] === title.trim()){
                                        const post_author = post.by
                                        if(user_name === post_author){
                                            
                                            const target_del_post = user_posts.indexOf(post)
                                            user_posts.splice(target_del_post, 1)

                                            await User.update({posts:user_posts}, { where: { userName: user_name}})

                                            const all_user_posts = await User.findOne({where: { userName: user_name}})
    
                                            return res.status(200).json({
                                               message: `${post.title} has been DELETED SUCCESSFULLY`,
                                               data: all_user_posts
                                            })
                                        }else{
                                            return res.status(400).json({
                                                messsage: `You are not the AUTHOR of this post`
                                            })
                                        }
                                    }
                            }
                       })
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






















