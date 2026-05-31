import React, {createContext, useState, useEffect} from "react";
import axios from "axios";

export const OrderContext = createContext();

export const OrderProvider = ({children}) => {
    const [orders, setOrders] = useState([]);
    const [allOrdes, setAllOrders] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState();
    const [completedOrders, setCompletedOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/orders/all");
            setOrders(res.data);
        } catch (err) {
            console.error("Lỗi khi lấy orders:", err);
        } finally {
        }
    };

    const handleUpdateStatus = (idOrder, statusId) => {
        return axios.put(`http://localhost:8080/api/orders/${idOrder}/update-status?statusId=${statusId}`);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const getMonthlyRevenue = async (year) => {
        try {
            const res = await axios.get(`http://localhost:8080/api/orders/monthly-revenue?year=${year}`);
            return res.data;
        } catch (err) {
            console.error("Lỗi lấy doanh thu tháng:", err);
            return [];
        }
    };

    const getCategoryRevenue = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/orders/category-revenue`);
            return res.data;
        } catch (err) {
            console.error("Lỗi lấy doanh thu theo loại:", err);
            return [];
        }
    };

    const getAllOrders = async() => {
        try {
            const res = await fetch(`http://localhost:8080/api/orders`);
            const data = await res.json();
            setAllOrders(data);
        } catch (error) {
            console.log(error)
        }
    }
    const getAllProducts = async() => {
        try {
            const res = await fetch(` http://localhost:8080/api/products`);
            const data = await res.json();
            setAllProducts(data);
        } catch (error) {
            console.log(error)
        }
    }
    const getTotalRevenue = async() => {
        try {
            const res = await fetch(`http://localhost:8080/api/orders/total-price/status/8`);
            const data = await res.json();
            setTotalRevenue(data);
        } catch (error) {
            console.log(error)
        }
    }
    const getcompletedOrders = async() => {
        try {
            const res = await fetch(`http://localhost:8080/api/orders/completed`);
            const data = await res.json();
            setCompletedOrders(data);
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