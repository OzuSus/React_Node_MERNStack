import {createNewPaymentMethodService, getAllPaymentMethodService} from "../services/paymentMethodService.js";
import {createNewDeliveryMethodService} from "../services/deliveryMethodService.js";

export async function getAllPaymentMethod(req,res,next) {
    try {
     const paymentMethods = await getAllPaymentMethodService();
     return res.status(200).json({message: "Lay danh sach phuong thuc thanh toan thanh cong!", paymentMethods})
    }catch (error) {
        next(error);
    }
}

export async function createNewPaymentMethod(req,res,next) {
    try{
        const formData = req.body;
        const newPaymentMethod = await createNewPaymentMethodService(formData)
        res.status(201).json({message: "Them phuong thuc thanh toan thanh cong!", paymentMethod: newPaymentMethod});
    }catch (error) {
        next(error);
    }
}