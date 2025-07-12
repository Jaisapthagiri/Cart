import express from 'express'
import authUser from "../middlewares/authUser.js";
import { uploadCart } from "../controllers/cartController.js";

const cartRouter = express.Router()
cartRouter.post('/upload' , authUser , uploadCart)

export default cartRouter