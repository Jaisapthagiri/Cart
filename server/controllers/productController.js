import { v2 as cloudinary } from 'cloudinary'
import Product from '../models/product.js'

export const addProduct = async (req, res) => {
    try {
        let productData = json.parse(req.body.productData)

        let images = req.files

        let imageUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path,
                    { resource_type: "images" })
                return result.secure_url
            })
        )
        await Product.create({ ...productData, image: imageUrl })

        res.json({ success: true, message: "Product Added" })

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

export const productList = async (req, res) => {
    try {
        const productList = await Product.find({})
        return res.json({ success: true, productList })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

export const productById = async (req, res) => {
    try {
        const { id } = req.body
        const productById = await Product.findById(id)
        res.json({ success: true, productById })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

export const changeStock = async (req, res) => {
    try {
        const {id,inStock} = req.body
        await Product.findByIdAndUpdate(id , {inStock})
        res.json({success : true , message : "Product Updated"})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}