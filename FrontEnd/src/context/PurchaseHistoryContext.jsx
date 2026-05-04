import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";

export const PurchaseHistoryContext = createContext();

export const PurchaseHistoryProvider = ({ children }) => {
    const [allStatuses, setAllStatuses] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const { user } = useContext(UserContext);


    const fetchAllStatuses = async () => {
        try {
            const response = await axios.get("http://localhost:5000/statusOrder",{
                    withCredentials: true,
            });
            if (response.data && response.data.statusOrders) {
                setAllStatuses(response.data.statusOrders);
            }
        } catch (err) {
            console.error("Error fetching statuses", err);
            setError(true);
        }finally {
            setLoading(false);
        }
    };

    const fetchAllOrders = async (userId) => {
        // setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/orders/${user._id}`,{
                withCredentials: true,
            });
            setOrders(response.data.orders || []);
            setError(false);
        } catch (err) {
            console.error("Error fetching all orders", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    // const fetchOrdersByStatus = async (statusId, userId) => {
    //     // setLoading(true);
    //     try {
    //         if (statusId === null) {
    //             await fetchAllOrders(userId);
    //         } else {
    //             const response = await axios.get(
    //                 `http://localhost:8080/api/orders/filter-by-status/${statusId}/${userId}`
    //             );
    //             setOrders(response.data);
    //         }
    //         setError(false);
    //     } catch (err) {
    //         console.error("Error fetching orders by status", err);
    //         setError(true);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleStatusChange = (statusId) => {
        setSelectedStatus(statusId);
        fetchOrdersByStatus(statusId, user?.id);
    };

    const cancelOrder = (orderId, userId) => {
        return axios.put(`http://localhost:8080/api/orders/cancel?orderId=${orderId}&userId=${userId}`);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            const options = { year: 'numeric', month: 'long', day: 'numeric'};
            return new Date(dateString).toLocaleDateString('vi-VN', options);
        } catch {
            return dateString;
        }
    };

    const formatPrice = (price) => {
        if (!price) return "N/A";
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const cleanImageUrl = (url) => {
        if (!url) return "/assets/jewelry.png";
        return url.replace(/\r\n/g, '').trim();
    };

    return (
        <PurchaseHistoryContext.Provider
            value={{
                allStatuses,
                orders,
                loading,
                error,
                selectedStatus,
                handleStatusChange,
                formatDate,
                formatPrice,
                cleanImageUrl,
                cancelOrder,
                fetchAllStatuses,
                fetchAllOrders,
            }}
        >
            {children}
        </PurchaseHistoryContext.Provider>
    );
};

export const usePurchaseHistory = () => useContext(PurchaseHistoryContext);
