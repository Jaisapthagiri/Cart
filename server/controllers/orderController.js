import Order from "../models/order.js"
import Product from "../models/product.js"

export const placeOrderCOD = async (req, res) => {
    try {
        const { userId } = req.userId
        const { items, address } = req.body

        if (!address) {
            return res.json({ success: false, message: "Please select address!" })
        }
        if (items.length === 0) {
            return res.json({ success: false, message: "Please select at least 1 item!" })
        }

        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product)
            retrun(await acc) + product.offerPrice * item.quantity
        }, 0)

        amount += Math.floor(amount * 0.2)

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD"
        })

        return res.json({ success: true, message: "Order Places Successfullly" })

    } catch (error) {
        return res.json({ success: fasle, message: error.message })

    }
}

export const getUserOrder = async (req, res) => {
    try {
        const { userId } = req.userId
        const orders = await Order.find({
            userId,
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        }).populate("items.product address").sort({ createdAt: -1 })
        res.json({ success: true, orders })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const getAllOrder = async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        }).populate("items.product address").sort({ createdAt: -1 })
        res.json({ success: true, orders })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
} 