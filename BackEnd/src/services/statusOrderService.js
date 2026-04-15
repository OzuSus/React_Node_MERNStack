import StatusOrder from "../models/StatusOrder.js";

export async function createNewStatusOrderService(name) {
    const statusOrder = await StatusOrder.create({ name: name });
    return statusOrder;
}

export async function getAllStatusOrderService() {
    const statusOrders = await StatusOrder.find();
    return statusOrders;
}