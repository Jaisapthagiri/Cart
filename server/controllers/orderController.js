import Order from "../models/order.js"
import Product from "../models/product.js"
import stripe from 'stripe';

export const placeOrderCOD = async (req, res) => {
    try {
        const userId = req.userId
        const { items, address } = req.body

        if (!address) {
            return res.json({ success: false, message: "Please select address!" })
        }
        if (items.length === 0) {
            return res.json({ success: false, message: "Please select at least 1 item!" })
        }

        let amount = 0;
        for (const item of items) {
            const product = await Product.findById(item.product);
            amount += product.offerPrice * item.quantity;
        }

        amount += Math.floor(amount * 0.2)

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD"
        })

        return res.json({ success: true, message: "Order Places Successfully" })

    } catch (error) {
        return res.json({ success: false, message: error.message })

    }
}

export const placeOrderStripe = async (req, res) => {
    try {
        const userId = req.userId
        const { items, address } = req.body
        const { origin } = req.headers

        if (!address) {
            return res.json({ success: false, message: "Please select address!" })
        }
        if (items.length === 0) {
            return res.json({ success: false, message: "Please select at least 1 item!" })
        }

        let productData = []
        let amount = 0;
        for (const item of items) {
            const product = await Product.findById(item.product);
            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity
            })
            amount += product.offerPrice * item.quantity;
        }

        amount += Math.floor(amount * 0.2)

        const order = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "Online"
        })

        const StripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)

        const line_items = productData.map((item) => {
            return {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: Math.floor(item.price + item.price * 0.02) * 100
                },
                quantity: item.quantity,
            }
        })

        const session = await StripeInstance.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${origin}/loader?next=my-orders`,
            cancel_url: `${origin}/cart`,
            metadata: {
                orderId: order._id.toString().
                    userId
            }
        })

        return res.json({ success: true, url: session.url })

    } catch (error) {
        return res.json({ success: false, message: error.message })

    }
}

// export const stripeWebHooks = async (req, res) => {
//     const StripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)
//     const sig = req.headers["stripe-signature"]
//     let event;

//     try {
//         event = StripeInstance.webhooks.constructEvent(
//             request.body,
//             sig,
//             process.env.STRIPE_WEBHOOK_SECRET
//         )
//     } catch (error) {
//         res.status(400).send(`WebHook Error : ${error.message}`)
//     }

//     switch (event.type) {
//         case "payment_intent.succeeded": {
//             const paymentIntent = event.data.object
//             const paymentIntentId = paymentIntent.id

//             const session = await stripeWebHooks.checkout.sessions.list({
//                 payment_intent: paymentIntentId,
//             })
//             const { orderId, userId } = session.data[0].metadata
//         }
//             await Order.findByIdAndUpdate(orderId , {isPaid : true})
//     }
// }

export const getUserOrder = async (req, res) => {
    try {
        const userId = req.userId
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