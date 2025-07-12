import express from 'express'
import authUser from '../middlewares/authUser.js';
import { getAllOrder, getUserOrder, placeOrderCOD, placeOrderStripe } from '../controllers/orderController.js';
import authSeller from '../middlewares/seller.js';

const orderRouter = express.Router()

orderRouter.post('/cod',authUser,placeOrderCOD)
orderRouter.get('/user',authUser,getUserOrder)
orderRouter.get('/seller',authSeller,getAllOrder)
orderRouter.post('/stripe',authUser,placeOrderStripe)


export default orderRouter;