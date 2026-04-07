import {getAllOrderService} from "../services/orderService.js";

export async function getAllOrders(req,res,next) {
    try {
     const orders = await getAllOrderService();
     return res.status(200).json({message: "Lay danh sach don hang thanh cong!", orders})
    }catch (error) {
        next(error);
    }
}