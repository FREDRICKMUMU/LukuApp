import express from "express";
import { getWishlist, toggleWishlistItem, removeFromWishlist, clearWishlist } from "../controllers/wishlistController.js";
import { protect } from "../middleware/auth.js";

const WishlistRouter = express.Router()

//Get user wishlist
WishlistRouter.get('/', protect, getWishlist)

//Toggle product in wishlist
WishlistRouter.post('/toggle', protect, toggleWishlistItem)

//Remove single product from wishlist
WishlistRouter.delete('/:productId', protect, removeFromWishlist)

//Clear wishlist
WishlistRouter.delete('/', protect, clearWishlist)

export default WishlistRouter;