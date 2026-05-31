import React, {createContext, useState, useEffect} from "react";
import {api} from "../utils/api";

export const OrderContext = createContext();

const normalizeOrder = (order) => {
    const status = order.status || order.status_order || {};
    const paymentMethod = order.paymentMethod || order.id_payment_method || {};
    const deliveryMethod = order.deliveryMethop || order.id_delivery_method || {};

    return {
        ...order,
        idOrder: order.idOrder || order._id,
        dateOrder: order.dateOrder || (order.date_order ? new Date(order.date_order).toLocaleDateString("vi-VN") : ""),
        paymentMethod: {
            ...paymentMethod,
            id: paymentMethod.id || paymentMethod._id,
            type_payment: paymentMethod.type_payment || paymentMethod.type_Payment || "N/A",
        },
        deliveryMethop: {
            ...deliveryMethod,
            id: deliveryMethod.id || deliveryMethod._id,
            name: deliveryMethod.name || "N/A",
        },
        status: {
            ...status,
            id: status.id || status._id,
            name: status.name || "N/A",
        },
        totalPrice: Number(order.totalPrice || order.total_price || 0),
        orderDetails: (order.orderDetails || []).map((detail) => {
            const product = detail.product || detail.id_product || {};
            return {
                ...detail,
                id: detail.id || detail._id,
                product: {
                    ...product,
                    id: product.id || product._id,
                    categoryID: product.categoryID || product.id_category?._id || product.id_category,
                },
            };
        }),
    };
};

export const OrderProvider = ({children}) => {
    const [orders, setOrders] = useState([]);
    const [allOrdes, setAllOrders] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState();
    const [completedOrders, setCompletedOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const res = await api.get("/orders", {params: {limit: 1000}});
            setOrders((res.data.orders || []).map(normalizeOrder));
        } catch (err) {
            console.error("Lỗi khi lấy orders:", err);
        } finally {
        }
    };

    const handleUpdateStatus = (idOrder, statusId) => {
        return api.put(`/orders/${idOrder}/update-status`, null, {params: {statusId}});
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const getMonthlyRevenue = async (year) => {
        try {
            const res = await api.get("/orders/monthly-revenue", {params: {year}});
            return res.data;
        } catch (err) {
            console.error("Lỗi lấy doanh thu tháng:", err);
            return [];
        }
    };

    const getCategoryRevenue = async () => {
        try {
            const res = await api.get("/orders/category-revenue");
            return res.data;
        } catch (err) {
            console.error("Lỗi lấy doanh thu theo loại:", err);
            return [];
        }
    };

    const getAllOrders = async() => {
        try {
            const res = await api.get("/orders", {params: {limit: 1000}});
            setAllOrders((res.data.orders || []).map(normalizeOrder));
        } catch (error) {
            console.log(error)
        }
    }
    const getAllProducts = async() => {
        try {
            const res = await api.get("/products", {params: {limit: 1000}});
            const data = res.data.product || res.data.products || res.data;
            setAllProducts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.log(error)
        }
    }
    const getTotalRevenue = async() => {
        try {
            const res = await api.get("/orders/total-revenue");
            setTotalRevenue(res.data.totalRevenue || 0);
        } catch (error) {
            console.log(error)
        }
    }
    const getcompletedOrders = async() => {
        try {
            const res = await api.get("/orders/completed");
            setCompletedOrders((res.data.orders || []).map(normalizeOrder));
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <OrderContext.Provider value={{fetchOrders, orders, refreshOrders: fetchOrders, handleUpdateStatus, getMonthlyRevenue, getCategoryRevenue, allOrdes, getAllOrders, allProducts, getAllProducts, totalRevenue, getTotalRevenue, completedOrders, getcompletedOrders}}>
            {children}
        </OrderContext.Provider>
    );
};
