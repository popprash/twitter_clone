import express from 'express'
import dotenv from 'dotenv'


import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import postRoutes from './routes/post.routes.js'
import notificationRoutes from './routes/notification.routes.js'

import connectMongoDB from './database/db.js'
import cookieParser from 'cookie-parser'
import {v2 as cloudinary} from 'cloudinary'


dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})


const app = express()

await connectMongoDB();

app.use(express.json({limit: "10mb"})) // to parse the json data
app.use(express.urlencoded({extended: true})) // to parse the form data
app.use(cookieParser())


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/notification', notificationRoutes)

console.log(process.env.CLOUDINARY_CLOUD_NAME);
console.log(process.env.CLOUDINARY_API_KEY);
console.log(process.env.CLOUDINARY_API_SECRET);

console.log(cloudinary.config())
const PORT = process.env.PORT || 8000

app.listen(PORT, (req, res)=>{
    console.log(`Server is up and runnig on port ${PORT}`)
})