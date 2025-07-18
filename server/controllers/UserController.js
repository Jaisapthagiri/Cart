import User from "../models/user.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Missing Values' })
        }

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.json({ success: false, message: 'Email already registered' })
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const user = await User.create({ name, email, password: hashPassword })
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(201).json({ success: true, user: { email: user.email, name: user.name }, token: token })

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

export const login = async (req, res) => {
    try {

        const { email, password } = req.body

        if (!email || !password) {
            return res.json({ success: false, message: "Email and Password are required" })
        }

        const user = await User.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch)
            return res.json({ success: false, message: "Email or password does not match" })
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(201).json({ success: true, user: { email: user.email, name: user.name }, token: token })

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}


export const isAuth = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select("-password")
        return res.json({ success: true, user })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        });
        return res.json({ success: true, message: "Logged Out" })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
} 