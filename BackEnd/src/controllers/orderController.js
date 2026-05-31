import {
    cancelOrderService,
    getAllOrderService,
    getCategoryRevenueService,
    getCompletedOrdersService,
    getMonthlyRevenueService,
    getOrderByStatusService,
    getOrderByUserService,
    getTotalRevenueService,
    placeOrderService,
    updateOrderStatusService
} from "../services/orderService.js";

export async function getAllOrders(req,res,next) {
    try {
     const page = parseInt(req.query.page) || 1;
     const limit = parseInt(req.query.limit) || 1000;
     const {orders, total} = await getAllOrderService(page, limit);
     return res.status(200).json({message: "Lay danh sach don hang thanh cong!", orders, total})
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
        const orders = await getOrderByStatusService(userId, status);
        return res.status(200).json({message: "Lấy đơn hàng theo người dùng thành công!", orders});
    }catch (err){
        next(err);
    }
}

export async function getOrderByUser(req,res,next) {
    try {
        const userId = req.params.userId;
        const orders = await getOrderByUserService(userId);
        return res.status(200).json({message: "Lấy đơn hàng theo người dùng thành công!", orders});
    }catch (err){
        next(err);
    }
}

export async function cancelOrder(req,res,next) {
    try{
        const { orderId } = req.body;
        const userId = req.user.id;
        await cancelOrderService(orderId, userId);
        return res.status(200).json({message: "Hủy đơn hàng thành công!"});
    }catch (err){
        next(err);
    }
}

export async function updateOrderStatus(req,res,next) {
    try{
        const statusId = req.query.statusId || req.body?.statusId;
        const order = await updateOrderStatusService(req.params.id, statusId);
        return res.status(200).json({message: "Cap nhat trang thai don hang thanh cong!", order});
    }catch (err){
        next(err);
    }
}

export async function getMonthlyRevenue(req,res,next) {
    try{
        const data = await getMonthlyRevenueService(req.query.year);
        return res.status(200).json(data);
    }catch (err){
        next(err);
    }
}

export async function getCategoryRevenue(req,res,next) {
    try{
        const data = await getCategoryRevenueService();
        return res.status(200).json(data);
    }catch (err){
        next(err);
    }
}

export async function getTotalRevenue(req,res,next) {
    try{
        const totalRevenue = await getTotalRevenueService();
        return res.status(200).json({totalRevenue});
    }catch (err){
        next(err);
    }
}

export async function getCompletedOrders(req,res,next) {
    try{
        const orders = await getCompletedOrdersService();
        return res.status(200).json({orders});
    }catch (err){
        next(err);
    }
}
