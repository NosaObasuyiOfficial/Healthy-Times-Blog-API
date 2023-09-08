import express from 'express'
import { create_post, make_comments, like_a_post, edit_post, delete_post } from '../controllers/posts'
import { get_all_posts, get_single_post } from '../controllers/getPosts'

const router = express.Router()

router.post('/create_post', create_post)

router.patch('/comments', make_comments)
router.patch('/likes', like_a_post)
router.patch('/post_update', edit_post)

router.delete('/delete', delete_post)

router.get('/all_posts', get_all_posts)
router.get('/post/:title', get_all_posts)


export default router

//Please validate most of your input
//POST TITLE MUST BE UNIQUE






















