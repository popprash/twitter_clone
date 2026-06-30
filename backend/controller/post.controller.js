import Notification from "../model/notification.model.js";
import Post from "../model/post.model.js";
import User from "../model/user.model.js";

import { v2 as cloudinary } from "cloudinary";

export const createPost = async (req , res)=>{
    try {
        const {text}= req.body;
        let {img} = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);
        if(!user) return res.status(404).json({message:"user Not Found"})

        if(!text && !img) {
            return res.status(400).json({message: "post must either contain a text and an Image"})
        }

        if(img){
            //upload it to the cloudinary
            const uploadedResponse = await cloudinary.uploader.upload(img)
            img =  uploadedResponse.secure_url; 
        }
        
        const newPost = new Post({
            user: userId,
            text,
            img
        })

        await newPost.save()
        return res.status(201).json({message: "post uploaded successfully", newPost})
        
    } catch (error) {
        console.error(`Error in the creatPost controller : ${error.message}`)
        return res.status(500).json({message: "internal server error"})
    }
}

export const deletePost = async (req, res) =>{
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({message:"post not found"})
        }

        if(post.user.toString() != req.user._id.toString()){
            return res.status(401).json({message: "you are unauthorized to delete the post"})
        }

        if(post.img){
            //destroy the image from the cloudinary
            const imgId = post.img.split('/').pop().split('.')[0]
            await cloudinary.uploader.destroy(imgId)
        }

        await Post.findByIdAndDelete(req.params.id)
        return res.status(200).json({message: "successfully deleted the post!"})
        
    } catch (error) {
        console.error(`Error in the deletePost controller : ${error.message}`)
        return res.status(500).json({message:"internal server error"})
        
    }
}

export const commentOnPost = async(req, res)=>{
    try {
        const {text} = req.body;
        const userId = req.user._id;
        const postId = req.params.id;



        if(!text){
            return res.status(400).json({message: "text is required for the comment"})
        }
        const post = await Post.findById(postId)
        
        if(!post){
            return res.status(404).json({message: "post not found 404"})
        }
        const comment = {user: userId , text}
        post.comments.push(comment)
        await post.save()

        return res.status(200).json({message:"comment added successfully"})
    } catch (error) {
        console.error(`Error in the commentOnPost controller : ${error.message}`)
        return res.status(500).json({message:"internal server error"})
        
    }
}

export const likeUnlikePost = async(req, res)=>{
    try {
        const {id:postId} = req.params; 
        const userId = req.user._id;
        
        const post = await Post.findById(postId)
        
        if(!post){
            return res.status(404).json({message: "post not found 404"})
        }

        if(post.likes.includes(userId)){
            //unlike the post
            post.likes = post.likes.filter((id)=> id.toString() !== userId.toString())
            await post.save()
            await User.updateOne({_id: userId}, {$pull: {likedPosts: postId}})
            return res.status(200).json({message:"post unliked successfully", likes: post.likes})
        }else{
            //like the post
            post.likes.push(userId)
            await post.save()
            await User.updateOne({_id: userId}, {$push: {likedPosts: postId}})
            //send the notification 
            const notification = new Notification({
                from: userId,
                to: post.user,
                type: "like",
                
            })
            await notification.save()
            return res.status(200).json({message:"post liked successfully" , likes: post.likes})
        }


    } catch (error) {
        console.error(`Error in the likeUnlikePost controller : ${error.message}`)
        return res.status(500).json({message:"internal server error"})
    }
}

export const getAllPosts = async(req, res)=>{
    try {
        const posts = await Post.find().sort({createdAt: -1}).populate({
            path: "user",
            select: "-password -email -createdAt -updatedAt -__v"
        })
        .populate({
            path: "comments.user",
            select: "-password -email -createdAt -updatedAt -__v"
        })
        if (posts.length === 0) {
            return res.status(200).json({message: "no posts found", posts: []})
        }
        return res.status(200).json({message: "posts fetched successfully", posts})

    } catch (error) {
        console.error(`Error in the getAllPosts controller : ${error.message}`)
        return res.status(500).json({message:"internal server error"})
        
    }
}

export const getLikedPosts = async(req, res)=>{
    const userId = req.params.id;
    try {
        const user = await User.findById(userId)
        const likedPosts = await Post.find({_id:{$in : user.likedPosts}}).sort({createdAt: -1}).populate({
            path: "user",
            select: "-password -email -createdAt -updatedAt -__v"
        }).populate({
            path: "comments.user",
            select: "-password -email -createdAt -updatedAt -__v"
        })
        return res.status(200).json({message: "liked posts fetched successfully", posts: likedPosts})
    } catch (error) {
        console.error(`Error in the getLikedPosts controller : ${error.message}`)
        return res.status(500).json({message:"internal server error"})
    }
}

export const getFollowingPosts = async(req, res)=>{
    try {
        const userId = req.user._id;
        const user  = await User.findById(userId)
        const followingPosts = await Post.find({user: {$in: user.following}}).populate({
            path: "user",
            select: "-password -email -createdAt -updatedAt -__v"
        }).populate({
            path: "comments.user",
            select: "-password -email -createdAt -updatedAt -__v"
        })
        return res.status(200).json({message: "following posts fetched successfully", posts: followingPosts})
    } catch (error) {
        console.error(`Error in the getFollowingPosts controller : ${error.message}`)
        return res.status(500).json({message:"internal server error"})
    }
}

export const getUserPosts = async(req, res)=>{
    try {
        const {username} = req.params;
        const user = await User.findOne({username})
        const userPosts = await Post.find({user: user._id}).sort({createdAt: -1}).populate({
            path: "user",
            select: "-password -email -createdAt -updatedAt -__v"
        }).populate({
            path: "comments.user",
            select: "-password -email -createdAt -updatedAt -__v"
        })
        return res.status(200).json({message: "user posts fetched successfully", posts: userPosts})
    } catch (error) {
        console.error(`Error in the getUserPosts controller : ${error.message}`)
        return res.status(500).json({message:"internal server error"})
    }
}