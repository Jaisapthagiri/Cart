import express from 'express'
import authUser from "../middlewares/authUser.js";
import { uploadCart } from "../controllers/cartController.js";

const cartRouter = express.Router()
cartRouter.post('/update' , authUser , uploadCart)

export default cartRouter;