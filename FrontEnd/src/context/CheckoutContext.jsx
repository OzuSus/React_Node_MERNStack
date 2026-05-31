import React, {createContext, useContext, useEffect, useState} from "react";
import Swal from "sweetalert2";
import {showConfirmDialog, showErrorDialog, showSuccessDialog} from "../utils/Alert";
import {useNavigate} from "react-router-dom";
import {api} from "../utils/api";


export const CheckoutContext = createContext();

export const CheckoutProvider = ({ children }) => {
    const [deliveryMethods, setDeliveryMethods] = useState([]);
    const [isLoadingDeliveryMethods, setIsLoadingDeliveryMethods] = useState(true);
    const [paymentMethods, setPaymentMethods] = useState([]);
    // const navigate = useNavigate();

    const fetchPaymentMethods = async () => {
        try {
            const response = await api.get("/paymentMethods");
            setPaymentMethods(response.data.paymentMethods);
        }catch (error) {
            console.error("Lỗi khi lấy phương thức thanh toán:", error);
        }finally {
            setIsLoadingDeliveryMethods(false);
        }
    }

    useEffect(() => {
        const fetchDeliveryMethods = async () => {
            try {
                const response = await api.get("/deliveryMethods");
                setDeliveryMethods(response.data.deliveryMethods);
            } catch (error) {
                console.error("Lỗi khi lấy phương thức giao hàng:", error);
            } finally {
                setIsLoadingDeliveryMethods(false);
            }
        };
        fetchDeliveryMethods();
        fetchPaymentMethods();
    }, []);



    const handlePlaceOrder = async (payload) => {
        try {

            const response = await api.post("/orders/place", payload);
            if (response.status === 200) {
                // await Swal.fire("Đặt hàng thành công", "Cảm ơn bạn đã mua hàng!", "success");
                return true;
            } else {
                await Swal.fire("Lỗi", "Đặt hàng không thành công.", "error");
                return false;
            }
        } catch (error) {
            console.error("Lỗi đặt hàng:", error);
            const errorMessage = error.response?.data?.message || error.message || "Đã xảy ra lỗi hệ thống";
            await Swal.fire("Lỗi", errorMessage, "error");
            return false;
        }
    };


    const createVnpayPayment = async (amount, content) => {
        try {
            const response = await api.post("/vnpay/vnpay_return", {
                amount: amount,
                content: content
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            return response.data;
        } catch (error) {
            await showErrorDialog("Lỗi", "Không thể tạo liên kết thanh toán VNPay.")
            return null;
        }
    };


    return (
        <CheckoutContext.Provider value={{deliveryMethods, isLoadingDeliveryMethods, handlePlaceOrder, createVnpayPayment, paymentMethods, fetchPaymentMethods}}>
            {children}
        </CheckoutContext.Provider>
    );
};
