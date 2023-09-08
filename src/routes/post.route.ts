import express from 'express'
import { create_post, make_comments, like_a_post, edit_post, delete_post } from '../controllers/posts'

const router = express.Router()

router.post('/create_post', create_post)
router.patch('/comments', make_comments)
router.patch('/likes', like_a_post)
router.patch('/post_update', edit_post)
router.delete('/delete', delete_post)


export default router

//Please validate most of your input
//POST TITLE MUST BE UNIQUE






















