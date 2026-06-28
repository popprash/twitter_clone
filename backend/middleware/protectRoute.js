import User from "../model/user.model.js";
import jwt from 'jsonwebtoken'

export const protectRoutes = async (req, res , next)=>{
    try {
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({message:"Unauthorized and no token Provided!"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SEC)

        if(!decoded){
            return res.status(401).json({message: "Unauthorized : Invalid Token"})
        }

        const user = await User.findById(decoded.userId).select("-password")
        if(!user){
            return res.status(404).json({message: "User not found"})
        }
        req.user = user;
        next()
        
    } catch (error) {
        console.error(`Error in protectRoute Middleware: ${error.message}`)

        return res.status(500).json({message:"internal server error"})

    }
}