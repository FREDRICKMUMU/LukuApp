import express from "express"
import { createOrder, getAllOrders, getOrder, getUserOrders, updateOrderStatus } from "../controllers/ordersController.js"
import { authorize, protect } from "../middleware/auth.js"

const OrderRouter = express.Router()

//Get user orders
OrderRouter.get('/', protect, getUserOrders)

//Get single order
OrderRouter.get('/:id', protect, getOrder)

//Create order from cart
OrderRouter.post('/', protect, createOrder)

//update order status (Admin only)
OrderRouter.put('/:id/status', protect, authorize("admin"), updateOrderStatus)

//Get all orders (Admin only)
OrderRouter.get('/admin/all', protect, authorize("admin"), getAllOrders)

export default OrderRouter;