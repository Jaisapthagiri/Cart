import express from 'express'
import { isSeller, sellerLogin, sellerLogout } from '../controllers/sellerController.js'
import authSeller from '../middlewares/seller.js'

const sellerRouter = express.Router()

sellerRouter.post('/login' , sellerLogin)
sellerRouter.get('/is-auth',authSeller , isSeller)
sellerRouter.get('/logout' , sellerLogout)

export default sellerRouter