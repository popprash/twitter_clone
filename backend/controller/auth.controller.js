import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../model/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {

  try {

    
    const {fullname, username, email , password} = req.body;
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    if(!emailRegex.test(email)) {
      return res.status(400).json({message: "Invalid Email Format"})
    }

    const existingUser = await User.findOne({username})
    if(existingUser){
      return res.status(400).json({message:"username is already taken "})
    }
    const existingEmail = await User.findOne({email})
    if(existingEmail){
      return res.status(400).json({message:"email is already taken "})
    }

    if(password.length <6 ) {return res.status(400).json({message:"password length must be longer than 6 characters"})}
    
    const salt = await bcrypt.genSalt(10)


    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
      fullname, 
      username,
      email,
      password: hashedPassword
    })

    if(newUser){
      generateTokenAndSetCookie(newUser._id, res)
      await newUser.save()

      return res.status(201).json({message:"user created successfully"})
    } else {
      return res.status(400).json({message: "Invalid user Data"})
    }
    
  } catch (error) {
    console.log(`Error : ${error.message}`)
    return res.status(500).json({message: "Internal Server Error"})
  }
  
};

export const login = async (req, res) => {
  try {
    const {password, username} = req.body;
    const user = await User.findOne({username})

    const isPasswordCorrect =  await bcrypt.compare(password, user?.password || "")

    if(!user || !isPasswordCorrect){
      return res.status(400).json({message: "Invalid Username or Password"})

    }
    generateTokenAndSetCookie(user._id, res);
    return res.status(200).json({message: "Login successfull"})
    
  } catch (error) {
    console.error("Error In the login controller", error.message)
    return res.status(500).json({message: "Internal Server Error"})
  }
  
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt","",{maxAge:0})
    return res.status(200).json({message: "logged Out successfully"})
  } catch (error) {
    console.error(`Error in logout controller ${error.message}`)
    return res.status(500).json({messsage: "internal server error"})
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password")
    res.status(200).json(user)
  } catch (error) {
    console.error (`Error in getMe controller : ${error.message}`)
    return res.status(500).json({message: "internal server error"})
  }
}