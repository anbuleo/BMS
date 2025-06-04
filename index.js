import express from "express";
import bodyParse from "body-parser";
import cors from "cors";
import env from "dotenv";
import router from './src/routes/index.js';


env.config();



const app = express()
app.use(bodyParse.json())
app.use(cors())

app.use('/api',router)

app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}`))



app.use((err,req,res,next)=>{
    
    const statusCode = err.statusCode || 500;
    const message = err.message || '❌ Internal server Error';
    return res.status(statusCode).json({
        success : false,
        statusCode,
        message
    })
})