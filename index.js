import express from "express";
import bodyParse from "body-parser";
import cors from "cors";
import env from "dotenv";
import router from './src/routes/index.js';


env.config();



const app = express()
app.use(bodyParse.json())
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://j411dgrf-3000.inc1.devtunnels.ms/',
  'https://j411dgrf-3001.inc1.devtunnels.ms/',
  'https://bookmyservice.co.in',
  'https://www.bookmyservice.co.in',
  'https://servyy.co.in',
  'https://www.servyy.co.in',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
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
