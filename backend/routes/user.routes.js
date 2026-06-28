import express from 'express'
import { protectRoutes } from '../middleware/protectRoute.js'
import { followUnfollowUser, getSuggestedUsers, getUserProfile, updateUserProfile } from '../controller/user.controller.js';

const router = express.Router()

router.get('/profile/:username', protectRoutes,getUserProfile)

router.get('/suggested',protectRoutes, getSuggestedUsers)

router.post('/follow/:id', protectRoutes, followUnfollowUser)

router.post('/update', protectRoutes , updateUserProfile)

export default router;