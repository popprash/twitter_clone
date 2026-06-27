import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes.js'
import connectMongoDB from './database/db.js'



dotenv.config()


const app = express()

connectMongoDB();

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 8000

app.listen(PORT, (req, res)=>{
    console.log(`Server is up and runnig on port ${PORT}`)
})