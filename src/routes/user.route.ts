import express from 'express'
import { user_Signup, user_verification, user_Login, user_profile_update } from '../controllers/user'

const router = express.Router()

router.post('/signup', user_Signup)
router.post('/confirmation/:signup_token', user_verification)
router.post('/login', user_Login)
router.patch('/profile_update', user_profile_update)

export default router