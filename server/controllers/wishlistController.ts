import { Request, Response } from "express";
import Wishlist from "../models/Wishlist.js";
import Product from "../models/Products.js";

//Get user wishlist
//GET /api/wishlist

export const getWishlist = async (req: Request, res: Response) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.user._id }).populate("products");

        if (!wishlist) {
            wishlist = await Wishlist.create({ user: req.user._id, products: [] })
        }

        res.json({ success: true, data: wishlist })
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
}

//Toggle product in wishlist (add if absent, remove if present)
//POST /api/wishlist/toggle

export const toggleWishlistItem = async (req: Request, res: Response) => {
    try {
        const { productId } = req.body;

        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        let wishlist = await Wishlist.findOne({ user: req.user._id })

        if (!wishlist) {
            wishlist = new Wishlist({ user: req.user._id, products: [] })
        }

        const index = wishlist.products.findIndex((id) => id.toString() === productId)

        if (index > -1) {
            wishlist.products.splice(index, 1)
        } else {
            wishlist.products.push(productId)
        }

        await wishlist.save()
        await wishlist.populate("products")

        res.json({ success: true, data: wishlist })
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
}

//Remove single product from wishlist
//DELETE /api/wishlist/:productId

export const removeFromWishlist = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;

        const wishlist = await Wishlist.findOne({ user: req.user._id })

        if (!wishlist) {
            return res.status(404).json({ success: false, message: "Wishlist not found" });
        }

        wishlist.products = wishlist.products.filter((id) => id.toString() !== productId)

        await wishlist.save()
        await wishlist.populate("products")

        res.json({ success: true, data: wishlist })
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
}

//Clear wishlist
//DELETE /api/wishlist

export const clearWishlist = async (req: Request, res: Response) => {
    try {
        const wishlist = await Wishlist.findOne({ user: req.user._id })

        if (wishlist) {
            wishlist.products = [];
            await wishlist.save();
        }

        res.json({ success: true, message: "Wishlist cleared" });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
}