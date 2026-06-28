import express from 'express'
import { getMe, login, logout, signup } from '../controller/auth.controller.js';
import { protectRoutes } from '../middleware/protectRoute.js';

const router = express.Router()

router.get('/me', protectRoutes, getMe)

router.post('/signup', signup)

router.post('/login', login)

router.post('/logout', logout)


export default router;