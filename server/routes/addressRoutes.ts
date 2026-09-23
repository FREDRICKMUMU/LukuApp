import express from "express"
import { addAddresses, deleteAddress, getAddresses, updateAddresses } from "../controllers/addressController.js"
import { protect } from "../middleware/auth.js" // confirm actual path

const AddressRouter = express.Router()

AddressRouter.get('/', protect, getAddresses)
AddressRouter.post('/', protect, addAddresses)
AddressRouter.put('/:id', protect, updateAddresses)
AddressRouter.delete('/:id', protect, deleteAddress)

export default AddressRouter;