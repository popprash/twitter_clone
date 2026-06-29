import express from 'express'
import { protectRoutes } from '../middleware/protectRoute.js';
import { commentOnPost, createPost, deletePost, getAllPosts, getFollowingPosts, getLikedPosts, getUserPosts, likeUnlikePost } from '../controller/post.controller.js';

const router = express.Router();

router.get('/all', protectRoutes, getAllPosts)

router.get('/likes/:id', protectRoutes, getLikedPosts)

router.get('/following', protectRoutes, getFollowingPosts)

router.get('/user/:username', protectRoutes, getUserPosts) //

router.post('/create', protectRoutes, createPost)

router.post('/like/:id', protectRoutes, likeUnlikePost)

router.post('/comment/:id',protectRoutes, commentOnPost)

router.delete('/:id',protectRoutes, deletePost)

export default router;