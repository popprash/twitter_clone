import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes.js'
import connectMongoDB from './database/db.js'
import cookieParser from 'cookie-parser'



dotenv.config()


const app = express()

await connectMongoDB();

app.use(express.json())
app.use(express.urlencoded({extended: true})) // to parse the form data
app.use(cookieParser())
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 8000

app.listen(PORT, (req, res)=>{
    console.log(`Server is up and runnig on port ${PORT}`)
})