import {createNewDeliveryMethodService, getAllDeliveryMethodService} from "../services/deliveryMethodService.js";

export async function createNewDeliveryMethod(req,res,next) {
    try {
        const formData = req.body;
        const newDeliveryMethod =await createNewDeliveryMethodService(formData)
        res.status(201).json({message: "Them phuong thuc van chuyen thanh cong!", deliveryMethod: newDeliveryMethod});
    }catch (error) {
        next(error);
    }
}

export async function getAllDeliveryMethod(req,res,next) {
    try {
        const deliveryMethods = await getAllDeliveryMethodService();
        res.status(200).json({message: "Lay danh sach phuong thuc van chuyen thanh cong!", deliveryMethods});
    }catch (error) {
        next(error);
    }
}