import {getAllOrderService, getOrderByStatusService, placeOrderService} from "../services/orderService.js";

export async function getAllOrders(req,res,next) {
    try {
     const orders = await getAllOrderService();
     return res.status(200).json({message: "Lay danh sach don hang thanh cong!", orders})
    }catch (error) {
        next(error);
    }
}

export async function placeOrder(req,res,next) {
    try {
        const formData = req.body;
        const userId = req.user.id;
        const order = await placeOrderService(userId, formData);
        return res.status(200).json({message: "Đặt hàng thành công!"}, order)
    }catch (error) {
        next(error);
    }
}

export async function getOrderByStatus(req,res,next) {
    try{
        const userId = req.user.id;
        const status = req.query.status;
        const order = await getOrderByStatusService(userId, status);
        return res.status(200).json({message: "Lấy đơn hàng theo trạng thái thành công!"}, order);
    }catch (err){
        next(err);
    }
}