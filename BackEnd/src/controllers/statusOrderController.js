import {createNewStatusOrderService, getAllStatusOrderService} from "../services/statusOrderService.js";

export async function createNewStatusOrder(req,res,next){
    try {
        const {name} = req.body;
        const statusOrder = await createNewStatusOrderService(name);
        return res.status(201).json({message: "Tạo mới trạng thái đơn hàng thành công", statusOrder});
    } catch (error) {
        next(error);
    }
}

export async function getAllStatusOrder(req,res,next){
    try{
        const statusOrders = await getAllStatusOrderService();
        return res.status(200).json({message: "Lấy danh sách trạng thái đơn hàng thành công", statusOrders});
    }catch (err){
        next(err);
    }
}