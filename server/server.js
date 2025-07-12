import cookieParser from 'cookie-parser';
import express from 'express'
import cors from 'cors'
import connectDB from './configs/db.js';
import 'dotenv/config'
import userRouter from './routes/UserRouter.js';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinari from './configs/connectCloudinari.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';

const app = express()
const PORT = process.env.PORT || 4000;

await connectDB()
await connectCloudinari()

const allowedOrgins = ['http://localhost:5173']

app.use(express.json())
app.use(cookieParser())
app.use(cors({origin : allowedOrgins ,credentials : true}))

app.get('/',(req , res) => 
    res.send("API is Working")
)
app.use('/api/user',userRouter)
app.use('/api/seller',sellerRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/address' , addressRouter)
app.use('/api/order' , orderRouter)

app.listen(PORT , () => {
    console.log(`API is running on http://localhost:${PORT}`);
})