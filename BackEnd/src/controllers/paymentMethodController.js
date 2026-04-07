import {getAllPaymentMethodService} from "../services/paymentMethodService.js";

export async function getAllPaymentMethod(req,res,next) {
    try {
     const paymentMethods = await getAllPaymentMethodService();
     return res.status(200).json({message: "Lay danh sach phuong thuc thanh toan thanh cong!", paymentMethods})
    }catch (error) {
        next(error);
    }
}